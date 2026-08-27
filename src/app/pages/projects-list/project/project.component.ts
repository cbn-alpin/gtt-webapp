import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { map, Observable, startWith } from 'rxjs';

import { ProjectsService } from 'src/app/core/services/projects/projects.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  projectForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  showDropdown = false;
  projectsGefiproj: any[] = [];
  filteredGefiprojProjects!: Observable<any[]>;
  isAutocompleting = false;
  manuallyEditingProjectName = false;
  manuallyEditingCode = false;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProjectComponent>);
  private readonly projectService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly cdRef = inject(ChangeDetectorRef);

  constructor() {
    this.projectForm = this.fb.group(
      {
        code: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        projectName: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: [''],
        hoursLimit: [''],
      },
      { validators: this.dateValidation }
    );
  }

  ngOnInit(): void {
    if (this.data?.project) {
      this.isEditMode = true;
      this.projectForm.patchValue({
        code: this.data.project.code,
        projectName: this.data.project.name,
        startDate: this.formatDateForForm(this.data.project.start_date),
        endDate: this.formatDateForForm(this.data.project.end_date),
        hoursLimit: this.data.project.hours_limit,
      });
    }

    // Retrieve list projects for auto-completion
    this.projectService.getGefiprojAllProjects().subscribe({
      next: (projects) => {
        this.projectsGefiproj = projects;
        this.initAutoComplete();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets de Gefiproj:', error);
      },
    });
  }

  dateValidation(group: AbstractControl) {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      group.get('endDate')?.setErrors({ dateInvalid: true });
      return { dateInvalid: true };
    }
    return null;
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.isSubmitting = true;
      const projectData: any = {
        code: this.projectForm.value.code,
        name: this.projectForm.value.projectName,
        start_date: this.formatDateForBackend(this.projectForm.value.startDate),
      };
      const end_date = this.formatDateForBackend(this.projectForm.value.endDate);
      if (end_date) {
        projectData['end_date'] = end_date;
      }
      if (this.projectForm.value.hoursLimit) {
        projectData['hours_limit'] = this.projectForm.value.hoursLimit;
      }

      if (this.isEditMode) {
        this.updateProject(projectData);
      } else {
        this.createProject(projectData);
      }
    }
  }

  createProject(projectData: any) {
    this.projectService.createProject(projectData).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.showToast(`Projet "${projectData.name}" créé avec succès 🎉`);
      },
      error: (error) => {
        this.showToast(`Erreur : ${error.message || 'Impossible de créer le projet'}`, true);
        this.isSubmitting = false;
      },
    });
  }

  updateProject(projectData: any) {
    this.projectService.updateProjectById(this.data.project.id_project, projectData).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.showToast(`Projet "${projectData.name}" mis à jour avec succès 🎉`, false);
      },
      error: (error) => {
        this.showToast(`Erreur : ${error.message || 'Mise à jour impossible'}`, true);
        this.isSubmitting = false;
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  autocompleteProjectName(code: string) {
    if (!code) {
      return;
    }

    this.isAutocompleting = true;
    const foundProject = this.projectsGefiproj.find((proj) => proj.code_p == code);
    if (foundProject) {
      this.projectForm.patchValue({ projectName: foundProject.nom_p });
      this.showToast(`Projet trouvé dans Gefiproj : "${foundProject.nom_p}"`, false);
    }
    this.isAutocompleting = false;
  }

  initAutoComplete() {
    this.filteredGefiprojProjects = this.projectForm.get('projectName')!.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? this.filterProjects(value) : this.projectsGefiproj
      )
    );

    this.projectForm.get('code')?.valueChanges.subscribe((value) => {
      if (value) {
        // Only if a value exists
        this.autocompleteByCode(value);
      }
    });
  }

  filterProjects(value: string): any[] {
    if (!value) {
      return [];
    }
    const filterValue = value.toLowerCase();
    const filteredProjects = this.projectsGefiproj.filter(
      (proj) =>
        proj.nom_p.toLowerCase().includes(filterValue) ||
        proj.code_p.toString().includes(filterValue)
    );
    this.showDropdown = filteredProjects.length > 0;
    this.cdRef.detectChanges();
    return filteredProjects;
  }

  hideDropdownWithDelay() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Short delay before clicking on an element
  }

  onProjectNameInput(event: Event) {
    if (this.isAutocompleting) return;

    this.manuallyEditingProjectName = true;
    const inputElement = event.target as HTMLInputElement;
    this.filterProjects(inputElement.value);
    this.manuallyEditingProjectName = false;
  }

  onCodeInput(event: Event) {
    if (this.isAutocompleting) return;

    this.manuallyEditingCode = true;
    const inputElement = event.target as HTMLInputElement;
    const newCode = inputElement.value;
    // If the code has been modified, search for the corresponding project
    if (newCode) {
      const foundProject = this.projectsGefiproj.find((proj) => proj.code_p == newCode);
      if (foundProject) {
        // If a matching project is found, update the name
        this.isAutocompleting = true;
        this.projectForm.patchValue({ projectName: foundProject.nom_p });
        this.isAutocompleting = false;
      } else {
        // If the code doesn't correspond to any project, delete the project name
        // only if the current name came from a previous autocompletion
        const currentName = this.projectForm.get('projectName')?.value;
        const projectWithCurrentName = this.projectsGefiproj.find(
          (proj) => proj.nom_p === currentName && proj.code_p !== newCode
        );

        if (projectWithCurrentName) {
          // The current name corresponds to another project, so it must be deleted.
          this.isAutocompleting = true;
          this.projectForm.patchValue({ projectName: '' });
          this.isAutocompleting = false;
        }
      }
    } else {
      // If the code is completely emptied, also delete the project name.
      this.isAutocompleting = true;
      this.projectForm.patchValue({ projectName: '' });
      this.isAutocompleting = false;
    }
    this.manuallyEditingCode = false;
  }

  autocompleteByCode(code: string) {
    if (!code) {
      this.manuallyEditingCode = true;
      return;
    }
    const foundProject = this.projectsGefiproj.find((proj) => proj.code_p == code);
    if (foundProject) {
      this.isAutocompleting = true;
      this.showToast(`Projet trouvé dans Gefiproj : "${foundProject.nom_p}"`, false);
      this.projectForm.patchValue({ projectName: foundProject.nom_p });
      this.isAutocompleting = false;
    }
    this.manuallyEditingCode = false;
  }

  selectGefiprojProject(project: any) {
    this.isAutocompleting = true;
    this.projectForm.patchValue({
      code: project.code_p,
      projectName: project.nom_p,
    });
    this.showDropdown = false;
    this.isAutocompleting = false;
    this.cdRef.detectChanges();
  }

  formatDateForBackend(dateStr: string): string | null {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-'); // "yyyy-MM-dd"
    return `${day}/${month}/${year}`; // "dd/MM/yyyy"
  }

  formatDateForForm(dateStr: string): string {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/'); // "dd/MM/yyyy"
    return `${year}-${month}-${day}`; // "yyyy-MM-dd"
  }

  showToast(message: string, isError = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}

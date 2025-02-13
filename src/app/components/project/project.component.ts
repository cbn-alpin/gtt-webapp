import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectsService } from 'src/app/services/projects/projects.service';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit{
  projectForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;

  constructor(private readonly fb: FormBuilder , 
    private readonly dialogRef: MatDialogRef<ProjectComponent>, 
    private readonly projectService: ProjectsService,
    private readonly snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.projectForm = this.fb.group(
        {
          projectId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
          projectName: ['', Validators.required],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required]
        },
        { validators: this.dateValidation } 
      );
    }

    ngOnInit(): void {
      if (this.data?.project) {
        this.isEditMode = true;
        this.projectForm.patchValue({
          projectId: this.data.project.code,
          projectName: this.data.project.name,
          startDate: this.data.project.start_date,
          endDate: this.data.project.end_date
        });
      }
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
      const projectData : any = {
        code: this.projectForm.value.projectId,
        name: this.projectForm.value.projectName,
        start_date: this.projectForm.value.startDate,
        end_date: this.projectForm.value.endDate
      };

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
      }
    });
  }

  updateProject(projectData: any) {
    this.projectService.updateProjectById(this.data.project.id_project, projectData).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.showToast(`Projet "${projectData.name}" mis à jour avec succès 🎉`);
      },
      error: (error) => {
        this.showToast(`Erreur : ${error.message || 'Mise à jour impossible'}`, true);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  showToast(message: string, isError: boolean = false) {
      this.snackBar.open(message, '', {
        duration: 5000, 
        panelClass: [isError ? 'error-toast' : 'success-toast'], 
        verticalPosition: 'top', 
        horizontalPosition: 'center', 
    });
  }
}

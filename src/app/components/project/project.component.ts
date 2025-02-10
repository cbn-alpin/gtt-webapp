import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectsService } from 'src/app/services/projects/projects.service';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  projectForm: FormGroup;
  isSubmitting = false;

  constructor(private readonly fb: FormBuilder , 
    private readonly dialogRef: MatDialogRef<ProjectComponent>, 
    private readonly projectService: ProjectsService,
    private readonly snackBar: MatSnackBar) {
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

      this.projectService.createProject(projectData).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          this.showToast(`Projet "${projectData.name}" créé avec succès 🎉`);
        },
        error: (error) => {
          this.showToast(`Erreur : ${error.message || 'Impossible de créer le projet'}`, true);
        }
      });
    }
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

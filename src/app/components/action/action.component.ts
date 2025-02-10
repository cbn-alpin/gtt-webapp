import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectActionsService } from 'src/app/services/projectActions/project-actions.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  id_project!: number;
  
  actionForm: FormGroup;
  isSubmitting = false;

  constructor(private readonly fb: FormBuilder,
    private readonly projectActionsService: ProjectActionsService, 
    private readonly dialogRef: MatDialogRef<ActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_project: number },
    private readonly snackBar: MatSnackBar) {
    this.id_project = data.id_project;
    this.actionForm = this.fb.group(
      {
        actionNum: ['', [Validators.pattern('^[0-9]+$')]], 
        name: ['', Validators.required],
        description: [''],
      },
    );
  }

  onSubmit() {
    if (this.actionForm.valid) {
      this.isSubmitting = true;
      const actionData : any = {
        name:this.actionForm.value.name,
        description:this.actionForm.value.description,
        id_project: this.id_project
      };

      this.projectActionsService.createProjectAction(actionData).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          this.showToast(`Action "${actionData.name}" créé avec succès 🎉`);
        },
        error: (error) => {
          this.showToast(`Erreur : ${error.message || 'Impossible de créer l action'}`, true);
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 4000, 
      panelClass: [isError ? 'error-toast' : 'success-toast'], 
      verticalPosition: 'top', 
      horizontalPosition: 'center', 
    });
  }
}
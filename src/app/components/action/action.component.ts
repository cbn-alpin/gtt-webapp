import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectActionsService } from 'src/app/services/projectActions/project-actions.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  id_project!: number;
  id_action?: number;
  actionForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;

  constructor(private readonly fb: FormBuilder,
    private readonly projectActionsService: ProjectActionsService, 
    private readonly dialogRef: MatDialogRef<ActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_project: number, action?: any },
    private readonly snackBar: MatSnackBar) {
    this.id_project = data.id_project;
    this.isEditMode = !!data.action; 
    this.id_action = data.action?.id_action;
    this.actionForm = this.fb.group(
      {
        actionNum: ['', Validators.required], 
        name: ['', Validators.required],
        description: [''],
      },
    );
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.action) {
      this.actionForm.patchValue({
        actionNum: this.data.action.numero_action|| '',
        name: this.data.action.name || '',
        description: this.data.action.description || ''
      });
    }
  }

  onSubmit() {
    if (this.actionForm.valid) {
      this.isSubmitting = true;
      const actionData = {
        numero_action: this.actionForm.value.actionNum, 
        name: this.actionForm.value.name,
        description: this.actionForm.value.description,
        id_project: this.id_project
      };

      if (this.isEditMode && this.id_action) {
        this.projectActionsService.updateActionById(this.id_action, actionData).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showToast(`Action "${actionData.name}" mise à jour`);
          },
          error: (error) => {
            this.showToast(`Erreur : ${error.message || 'Mise à jour impossible'}`, true);
            this.isSubmitting = false;
          }
        });
      } else {
        this.projectActionsService.createProjectAction(actionData).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showToast(`Action "${actionData.name}" créée avec succès 🎉`);
          },
          error: (error) => {
            this.showToast(`Erreur : ${error.message || 'Création impossible'}`, true);
            this.isSubmitting = false;
          }
        });
      }
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
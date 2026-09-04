import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProjectActionsService } from 'src/app/core/services/project-actions/project-actions.service';

@Component({
  selector: 'app-action',
  standalone: true,
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule],
})
export class ActionComponent implements OnInit {
  id_project!: number;
  id_action?: number;
  actionForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;

  private readonly fb = inject(FormBuilder);
  private readonly projectActionsService = inject(ProjectActionsService);
  private readonly dialogRef = inject(MatDialogRef<ActionComponent>);
  readonly data = inject<{ id_project: number; action?: any }>(MAT_DIALOG_DATA);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.id_project = this.data.id_project;
    this.isEditMode = !!this.data.action;
    this.id_action = this.data.action?.id_action;
    this.actionForm = this.fb.group({
      actionNum: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.action) {
      this.actionForm.patchValue({
        actionNum: this.data.action.numero_action || '',
        name: this.data.action.name || '',
        description: this.data.action.description || '',
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
        id_project: this.id_project,
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
          },
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
          },
        });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  showToast(message: string, isError = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: [isError ? 'error-toast' : 'success-toast'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mission-expense',
  templateUrl: './mission-expense.component.html',
  styleUrls: ['./mission-expense.component.scss']
})
export class MissionExpenseComponent {
  missionForm: FormGroup;
  isSubmitting = false;
  id_travel = Number(localStorage.getItem('id_travel'));

  constructor(private readonly fb: FormBuilder, private readonly dialogRef: MatDialogRef<MissionExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_travel: number } ){
     this.missionForm = this.fb.group(
          {
            name: [''], 
            comment: [''],
            amount: [''],
            id_travel: [this.id_travel] // Stocke l'ID ici
          },
        );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.missionForm.valid) {
      this.dialogRef.close(this.missionForm.value);
    }
  }
}

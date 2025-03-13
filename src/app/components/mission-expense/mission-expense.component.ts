import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShareDataService } from 'src/app/services/shareData/share-data.service';

@Component({
  selector: 'app-mission-expense',
  templateUrl: './mission-expense.component.html',
  styleUrls: ['./mission-expense.component.scss']
})
export class MissionExpenseComponent implements OnInit {
  missionForm: FormGroup;
  isSubmitting = false;
  id_travel? : Number;
  isEditMode = false;

  ngOnInit(): void {
    this.shareDataService.newTravelId$.subscribe(id => {
      this.id_travel = id;
    });

    console.error('ID Travel utilisé dans ListMissionExpense:', this.id_travel);
  }

  constructor(private readonly fb: FormBuilder, private readonly dialogRef: MatDialogRef<MissionExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_travel: number, expense?: any }, private shareDataService : ShareDataService ){
      this.missionForm = this.fb.group({
        name: [data.expense ? data.expense.name : ''], 
        comment: [data.expense ? data.expense.comment : ''],
        amount: [data.expense ? data.expense.amount : ''],
      });

      this.isEditMode = !!this.data.expense;

    console.error('Ouverture du dialogue avec ID Travel dans missionExpenseComponent:', this.id_travel);
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

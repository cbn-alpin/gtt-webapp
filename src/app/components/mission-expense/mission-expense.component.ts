import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ShareDataService } from 'src/app/services/share-data/share-data.service';

@Component({
  selector: 'app-mission-expense',
  templateUrl: './mission-expense.component.html',
  styleUrls: ['./mission-expense.component.scss'],
})
export class MissionExpenseComponent implements OnInit {
  missionForm: FormGroup;
  isSubmitting = false;
  id_travel?: number;
  isEditMode = false;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MissionExpenseComponent>);
  readonly data = inject<{ id_travel: number; expense?: any }>(MAT_DIALOG_DATA);
  private readonly shareDataService = inject(ShareDataService);

  constructor() {
    this.missionForm = this.fb.group({
      name: [this.data.expense ? this.data.expense.name : ''],
      comment: [this.data.expense ? this.data.expense.comment : ''],
      amount: [this.data.expense ? this.data.expense.amount : ''],
    });
    this.isEditMode = !!this.data.expense;
  }

  ngOnInit(): void {
    this.shareDataService.newTravelId$.subscribe((id) => {
      this.id_travel = id;
    });
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

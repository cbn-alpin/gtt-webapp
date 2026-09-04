import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ShareDataService } from 'src/app/core/services/share-data/share-data.service';

@Component({
  selector: 'app-expense-item-dialog',
  standalone: true,
  templateUrl: './expense-item-dialog.component.html',
  styleUrls: ['./expense-item-dialog.component.scss'],
  imports: [ReactiveFormsModule],
})
export class ExpenseItemDialogComponent implements OnInit {
  expenseForm: FormGroup;
  isSubmitting = false;
  id_travel?: number;
  isEditMode = false;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ExpenseItemDialogComponent>);
  readonly data = inject<{ id_travel: number; expense?: any }>(MAT_DIALOG_DATA);
  private readonly shareDataService = inject(ShareDataService);

  constructor() {
    this.expenseForm = this.fb.group({
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
    if (this.expenseForm.valid) {
      this.dialogRef.close(this.expenseForm.value);
    }
  }
}

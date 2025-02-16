import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mission-expense',
  templateUrl: './mission-expense.component.html',
  styleUrls: ['./mission-expense.component.scss']
})
export class MissionExpenseComponent {
  missionForm: FormGroup;
  isSubmitting = false;

  constructor(private readonly fb: FormBuilder){
     this.missionForm = this.fb.group(
          {
            object: [''], 
            comment: [''],
            amount: [''],
          },
        );
  }
}

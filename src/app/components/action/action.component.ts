import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  actionForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.actionForm = this.fb.group({
      actionNumber: ['', Validators.required],
      actionName: ['', Validators.required],
      actionDescription: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.actionForm.valid) {
      console.log('Formulaire soumis :', this.actionForm.value);
      alert('Action ajoutée avec succès');
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }
}
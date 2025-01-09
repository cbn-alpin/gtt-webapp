import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  projectForm: FormGroup;

  constructor(private readonly fb: FormBuilder , private readonly dialogRef: MatDialogRef<ProjectComponent>) {
    this.projectForm = this.fb.group({
      projectId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Projet soumis :', this.projectForm.value);
    } else {
      console.log('Formulaire invalide.');
    }
  }

  onClose(): void {
    console.log('Formulaire fermé');
    this.dialogRef.close();
  }
  
}

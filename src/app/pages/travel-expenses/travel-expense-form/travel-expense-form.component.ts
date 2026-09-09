import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Observable, startWith, switchMap } from 'rxjs';

import { DateTime } from 'luxon';

import { Project } from 'src/app/core/models/project.model';
import { ExpensesService } from 'src/app/core/services/expenses/expenses.service';
import { MunicipalityService } from 'src/app/core/services/municipality/municipality.service';
import { ProjectsService } from 'src/app/core/services/projects/projects.service';
import { ShareDataService } from 'src/app/core/services/share-data/share-data.service';
import { ExpenseItemListComponent } from './expense-item-list/expense-item-list.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-travel-expense-form',
  standalone: true,
  templateUrl: './travel-expense-form.component.html',
  styleUrls: ['./travel-expense-form.component.scss'],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    ExpenseItemListComponent,
  ],
})
export class TravelExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  projects: Project[] = [];
  projectId!: number;
  filteredCommunesStart!: Observable<any[]>;
  filteredCommunesDestination!: Observable<any[]>;
  filteredCommunesReturn!: Observable<any[]>;
  filteredCommunesNight!: Observable<any[]>;
  vehicleOptions = ['Service', 'Personnel', 'Location', 'Covoiturage'];
  residenceOptions = ['Résidence Administrative', 'Résidence Familiale'];
  isEditing = false;
  isSubmitting = false;
  travelId!: number;
  savedProjectCode: any;
  list_mission_expenses: any[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly projectService = inject(ProjectsService);
  private readonly expenseService = inject(ExpensesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly shareDataService = inject(ShareDataService);

  constructor() {
    this.expenseForm = this.fb.group({
      projectCode: ['', Validators.required],
      projectName: [''],
      purpose: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      startResidence: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      endResidence: ['', Validators.required],
      startMunicipality: ['', Validators.required],
      destinationMunicipality: ['', Validators.required],
      returnMunicipality: ['', Validators.required],

      nightMunicipality: ['', Validators.required],
      nightCount: [''],
      mealCount: [''],

      vehicleLicense: [''],
      vehicleComment: [''],
      startKm: [''],
      endKm: [''],
      totalKm: [''],

      comments: [''],
    });
  }

  ngOnInit(): void {
    this.filteredCommunesStart = this.setupAutocomplete('startMunicipality');
    this.filteredCommunesDestination = this.setupAutocomplete('destinationMunicipality');
    this.filteredCommunesReturn = this.setupAutocomplete('returnMunicipality');
    this.filteredCommunesNight = this.setupAutocomplete('nightMunicipality');

    // Retrieve list projects for auto-completion
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;

        // Check if you have a publishing project
        if (this.savedProjectCode) {
          this.autocompleteProjectName(this.savedProjectCode);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets :', error);
      },
    });

    // listen changements of "code" field
    this.expenseForm.get('projectCode')?.valueChanges.subscribe((value) => {
      this.autocompleteProjectName(value);
    });

    // Automatic calculation of totalKm
    this.expenseForm.get('startKm')!.valueChanges.subscribe(() => this.calculateTotalKm());
    this.expenseForm.get('endKm')!.valueChanges.subscribe(() => this.calculateTotalKm());

    this.expenseForm.get('startDate')?.valueChanges.subscribe(() => this.validateEndDate());
    this.expenseForm.get('endDate')?.valueChanges.subscribe(() => this.validateEndDate());

    this.loadTravelData();
  }

  private autocompleteProjectName(code: string) {
    if (!code) {
      this.expenseForm.patchValue({ projectName: '' });
      return;
    }
    // find the same project code
    const foundProject = this.projects.find((proj) => proj.code == Number(code));
    if (foundProject) {
      // Auto-complete the project name
      this.expenseForm.patchValue({ projectName: foundProject.name });
      this.projectId = foundProject.id_project;
    } else {
      this.expenseForm.patchValue({ projectName: '' });
    }
  }

  private setupAutocomplete(controlName: string): Observable<any[]> {
    return this.expenseForm.get(controlName)!.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this.municipalityService.getCommunes(value || ''))
    );
  }

  displayCommune(commune: any): string {
    return commune ? `${commune.nom} (${commune.codesPostaux[0]})` : '';
  }

  save(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      this.showToast('Veuillez remplir tous les champs obligatoires.', true);
      return;
    }

    this.isSubmitting = true;
    const formData = this.expenseForm.value;

    // Check that start and end times are correct
    if (!formData.startTime || !formData.endTime) {
      this.showToast("L'heure de début et de fin sont obligatoires.", true);
      return;
    }

    const userId = Number(localStorage.getItem('id_user'));
    const travelData = this.mapFormDataToTravelData(formData);

    if (this.isEditing && this.travelId) {
      this.updateTravelExpense(userId, travelData);
    } else {
      this.createTravelExpense(userId, travelData);
    }
  }

  private formatDate(date: any, timeString?: string): string {
    if (!date) return '';

    const parsedDate: DateTime = this.parseDateValue(date);
    if (!parsedDate.isValid) return '';

    // Always return the date in DD/MM/YYYY format
    // If it's a creation, we add the seconds “:00”.
    return this.isEditing
      ? `${parsedDate.toFormat('dd/MM/yyyy')} ${timeString}`
      : `${parsedDate.toFormat('dd/MM/yyyy')} ${timeString}:00`;
  }

  cancel(): void {
    this.router.navigate(['accueil/liste-frais-deplacement/']);
    this.expenseForm.reset();
  }

  private calculateTotalKm(): void {
    const startKm = this.expenseForm.get('startKm')!.value;
    const endKm = this.expenseForm.get('endKm')!.value;

    if (startKm !== null && endKm !== null && endKm >= startKm) {
      this.expenseForm.patchValue({ totalKm: endKm - startKm });
    } else {
      this.expenseForm.patchValue({ totalKm: null });
    }
  }

  private loadTravelData(): void {
    const state = history.state;
    if (state?.travelData) {
      this.isEditing = true;
      this.travelId = state.travelData.id_travel;
      this.list_mission_expenses = state.travelData.list_expenses;
      localStorage.setItem('id_travel', state.travelData.id_travel);

      const formatDateForInput = (dateString: string) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD format
      };

      // Pre-fill the form with existing data
      this.expenseForm.patchValue({
        projectCode: state.travelData.project_code,
        projectName: this.autocompleteProjectName(state.travelData.project_code),
        purpose: state.travelData.purpose,
        startDate: formatDateForInput(state.travelData.start_date.split(' ')[0]),
        startTime: state.travelData.start_date.split(' ')[1],
        startResidence: state.travelData.start_place,
        endDate: formatDateForInput(state.travelData.end_date.split(' ')[0]),
        endTime: state.travelData.end_date.split(' ')[1],
        endResidence: state.travelData.return_place,
        startMunicipality: this.parseMunicipality(state.travelData.start_municipality),
        destinationMunicipality: this.parseMunicipality(state.travelData.destination),
        returnMunicipality: this.parseMunicipality(state.travelData.end_municipality),
        nightMunicipality: this.parseMunicipality(state.travelData.night_municipality),
        nightCount: state.travelData.night_count,
        mealCount: state.travelData.meal_count,

        vehicleLicense: state.travelData.license_vehicle,
        vehicleComment: state.travelData.comment_vehicle,
        startKm: state.travelData.start_km,
        endKm: state.travelData.end_km,

        comments: state.travelData.comment,
      });
      this.savedProjectCode = state.travelData.project_code;
    }
  }

  preventEnterSubmit(event: Event) {
    if (event instanceof KeyboardEvent) {
      const target = event.target as HTMLElement;

      // Check that the focus is not on a button
      if (target.tagName !== 'BUTTON') {
        event.preventDefault(); // Prevents form submission
      }
    }
  }

  private validateEndDate(): void {
    const startDate = this.expenseForm.get('startDate')?.value;
    const endDate = this.expenseForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start: DateTime = this.parseDateValue(startDate);
      const end: DateTime = this.parseDateValue(endDate);

      if (end < start) {
        this.expenseForm.get('endDate')?.setErrors({ invalidEndDate: true });
      } else {
        this.expenseForm.get('endDate')?.setErrors(null);
      }
    }
  }

  // Handle Date, DateTime, Moment or string
  private parseDateValue(val: any): DateTime {
    let parsedDate: DateTime;
    if (val instanceof Date) {
      parsedDate = DateTime.fromJSDate(val);
    } else if (DateTime.isDateTime(val)) {
      parsedDate = val;
    } else if (val && typeof val.toDate === 'function') {
      // It's a Moment object (or Day.js)
      parsedDate = DateTime.fromJSDate(val.toDate());
    } else {
      // Checks if date is in the expected format (DD/MM/YYYY or YYYY-MM-DD)
      parsedDate = DateTime.fromFormat(val, 'dd/MM/yyyy');
      if (!parsedDate.isValid) {
        parsedDate = DateTime.fromFormat(val, 'yyyy-MM-dd');
      }
    }
    return parsedDate;
  };

  private parseMunicipality(value: string): any {
    const match = value.match(/^(.*?) \((\d{5})\)$/);
    return match ? { nom: match[1], codesPostaux: [match[2]] } : null;
  }

  private showToast(message: string, isError = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  private mapFormDataToTravelData(formData: any): any {
    return {
      start_date: this.formatDate(formData.startDate, formData.startTime),
      end_date: this.formatDate(formData.endDate, formData.endTime),
      start_place: formData.startResidence,
      return_place: formData.endResidence,
      status: 'A Traiter',
      purpose: formData.purpose,
      start_municipality: `${formData.startMunicipality.nom} (${formData.startMunicipality.codesPostaux[0]})`,
      end_municipality: `${formData.returnMunicipality.nom} (${formData.returnMunicipality.codesPostaux[0]})`,
      destination: `${formData.destinationMunicipality.nom} (${formData.destinationMunicipality.codesPostaux[0]})`,
      night_municipality: `${formData.nightMunicipality.nom} (${formData.nightMunicipality.codesPostaux[0]})`,
      night_count: formData.nightCount || 0,
      meal_count: formData.mealCount || 0,
      comment: formData.comments,
      license_vehicle: formData.vehicleLicense,
      comment_vehicle: formData.vehicleComment,
      start_km: formData.startKm || 0,
      end_km: formData.endKm || 0,
    };
  }

  private updateTravelExpense(userId: number, travelData: any): void {
    travelData.status = history.state.travelData.status;
    this.shareDataService.sendTravelId(this.travelId);

    this.expenseService.updateUserTravelExpense(this.travelId, userId, travelData).subscribe({
      next: () => {
        this.shareDataService.validateTravelExpense();
        // Check if mission expenses are added
        this.shareDataService.missionExpensesProcessed$.subscribe(() => {
          this.showToast(`Frais de déplacement mis à jour avec succès. 🎉`);
        });

        this.router.navigate(['accueil/liste-frais-deplacement/']);
      },
      error: (error) => {
        console.log('Erreur lors de la mise à jour du frais de déplacement.', error);
        this.showToast(`Erreur lors de mise à jour du frais de déplacement.`, true);
        this.isSubmitting = false;
      },
    });
  }

  private createTravelExpense(userId: number, travelData: any): void {
    this.expenseService.createTravelExpense(userId, this.projectId, travelData).subscribe({
      next: (travelExpense) => {
        this.shareDataService.sendTravelId(travelExpense.travel_id);
        this.shareDataService.validateTravelExpense();

        // Check if mission expenses are added
        this.shareDataService.missionExpensesProcessed$.subscribe((success) => {
          this.showToast(
            success
              ? 'Frais de déplacement créé avec succès.'
              : `Frais de déplacement créé, mais aucun frais de mission ajouté.`
          );
        });

        // Redirection after creation
        this.router.navigate(['accueil/liste-frais-deplacement/']);
      },
      error: (error) => {
        console.log('Erreur lors de la création du frais de déplacement.', error);
        this.showToast(`Erreur lors de la création du frais de déplacement.`, true);
        this.isSubmitting = false;
      },
    });
  }
}

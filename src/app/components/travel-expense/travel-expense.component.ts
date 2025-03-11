import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith, switchMap, tap } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { MunicipalityService } from 'src/app/services/municipality/municipality.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ShareDataService } from 'src/app/services/shareData/share-data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-travel-expense',
  templateUrl: './travel-expense.component.html',
  styleUrls: ['./travel-expense.component.scss']
})
export class TravelExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  projects: Project[] = []; 
  projectId!: number;
  filteredCommunesStart!: Observable<any[]>;
  filteredCommunesDestination!: Observable<any[]>;
  filteredCommunesReturn!: Observable<any[]>;
  filteredCommunesNight!: Observable<any[]>;
  vehicleOptions = ['Service', 'Personnel', 'Location', 'Covoiturage'];
  residenceOptions = ['Résidence Administrative', 'Résidence Familiale'];
  isEditing: boolean = false;
  isSubmitting = false;
  travelId!: number;
  savedProjectCode : any;
  list_mission_expenses : any[] = []; 
  

  constructor(private fb: FormBuilder, private municipalityService : MunicipalityService, 
    private readonly projectService: ProjectsService, private expenseService: ExpensesService, 
    private readonly snackBar: MatSnackBar, private router: Router,
    private shareDataService : ShareDataService) {

    this.expenseForm = this.fb.group({
      projectCode: ['', Validators.required],
      projectName: [''],
      purpose: ['',Validators.required],
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

      comments: ['']
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
    
        // Vérifier si on a un projet en édition
        if (this.savedProjectCode) {
          this.autocompleteProjectName(this.savedProjectCode);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets :', error);
      }
    });
    

    // listen changements of "code" field
    this.expenseForm.get('projectCode')?.valueChanges.subscribe(value => {
      this.autocompleteProjectName(value);
    });

     // Calcul automatique du totalKm
    this.expenseForm.get('startKm')!.valueChanges.subscribe(() => this.calculateTotalKm());
    this.expenseForm.get('endKm')!.valueChanges.subscribe(() => this.calculateTotalKm());

    this.expenseForm.get('startDate')?.valueChanges.subscribe(() => this.validateEndDate());
    this.expenseForm.get('endDate')?.valueChanges.subscribe(() => this.validateEndDate());

    this.loadTravelData();
  }

 
  autocompleteProjectName(code: string) {
    if (!code) {
      this.expenseForm.patchValue({ projectName: '' }); 
      return;
    }
    // find the same project code
    const foundProject = this.projects.find(proj => proj.code == Number(code));
    if (foundProject) {
      // Auto-complete the project name
      this.expenseForm.patchValue({ projectName: foundProject.name });
      this.projectId = foundProject.id_project;
    }
    else {
      this.expenseForm.patchValue({ projectName: '' });
    }
  }

  setupAutocomplete(controlName: string): Observable<any[]> {
    return this.expenseForm.get(controlName)!.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.municipalityService.getCommunes(value || '').pipe(
        tap((communes:any) => console.error('Communes reçues:', communes))
      ))
    );
  }

  displayCommune(commune: any): string {
    return commune ? `${commune.nom} (${commune.codesPostaux[0]})` : '';
  }  
  
  save(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched(); // Force l'affichage des erreurs
      setTimeout(() => {
        this.showToast('Veuillez remplir tous les champs obligatoires.', true);
      });
      return;
    }
  
    this.isSubmitting = true;
    const formData = this.expenseForm.value;
  
    // Vérifier si les heures de début et de fin sont renseignées
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
  
  /**
   * Mappe les données du formulaire en un objet `travelData`
   */
  private mapFormDataToTravelData(formData: any): any {
    return {
      start_date: this.formatDate(formData.startDate, formData.startTime),
      end_date: this.formatDate(formData.endDate, formData.endTime),
      start_place: formData.startResidence,
      return_place: formData.endResidence,
      status: "A Traiter",
      purpose: formData.purpose,
      start_municipality: formData.startMunicipality,
      end_municipality: formData.returnMunicipality,
      destination: formData.destinationMunicipality,
      night_municipality: formData.nightMunicipality,
      night_count: formData.nightCount || 0,
      meal_count: formData.mealCount || 0,
      comment: formData.comments,
      license_vehicle: formData.vehicleLicense,
      comment_vehicle: formData.vehicleComment,
      start_km: formData.startKm || 0,
      end_km: formData.endKm || 0
    };
  }
  
  /**
   * Met à jour un frais de déplacement existant
   */
  private updateTravelExpense(userId: number, travelData: any): void {
    travelData.status = history.state.travelData.status;
    this.shareDataService.sendTravelId(this.travelId);
    console.error('Travel ID à modifier:', this.travelId);
  
    this.expenseService.updateUserTravelExpense(this.travelId, userId, travelData).subscribe({
      next: () => {
        console.error('Travel data modifié:', travelData);
        this.shareDataService.validateTravelExpense();
        this.router.navigate(['accueil/liste-frais-de-deplacement/']);
  
        setTimeout(() => {
          this.showToast(`Frais de déplacement mis à jour avec succès. 🎉`);
        }, 1000);
      },
      error: () => {this.showToast(`Erreur lors de mise à jour du frais de déplacement.`, true),
        this.isSubmitting = false;
      }
    });
  }
  
  /**
   * Crée un nouveau frais de déplacement
   */
  private createTravelExpense(userId: number, travelData: any): void {
    this.expenseService.createTravelExpense(userId, this.projectId, travelData)
      .subscribe({
        next: (travelexpense) => {
          console.error('Nouveau Travel créé:', travelexpense);
          console.error('Nouveau ID Travel créé:', travelexpense.travel_id);
  
          this.shareDataService.sendTravelId(travelexpense.travel_id);
          this.shareDataService.validateTravelExpense();
  
          // Vérifier si des frais de mission sont ajoutés
          this.shareDataService.missionExpensesProcessed$.subscribe(success => {
            this.showToast(success
              ? 'Frais de déplacement créé avec succès.'
              : `Frais de déplacement créé, mais aucun frais de mission ajouté.`
            );
          });
  
          // Redirection après la création
          this.router.navigate(['accueil/liste-frais-de-deplacement/']);
        },
        error: (error) => {
          console.log('Erreur lors de la création du frais de déplacement.', error);
          this.showToast(`Erreur lors de la création du frais de déplacement.`, true);
          this.isSubmitting = false;
        }
      });
  }
  
  formatDate(date: string, timeString?: string): string {
    if (!date) return '';
  
    // Vérifie si la date est au format attendu (DD/MM/YYYY ou YYYY-MM-DD)
    let parsedDate = moment(date, ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
  
    if (!parsedDate.isValid()) return '';
  
    // Toujours retourner la date au format DD/MM/YYYY
    // Si c'est une création, on ajoute les secondes ":00"
    return this.isEditing
    ? `${parsedDate.format('DD/MM/YYYY')} ${timeString}`
    : `${parsedDate.format('DD/MM/YYYY')} ${timeString}:00`;
  }
  
  
  cancel(): void {
    this.router.navigate(['accueil/liste-frais-de-deplacement/']);
    this.expenseForm.reset();
  }

  calculateTotalKm(): void {
    const startKm = this.expenseForm.get('startKm')!.value;
    const endKm = this.expenseForm.get('endKm')!.value;
  
    if (startKm !== null && endKm !== null && endKm >= startKm) {
      this.expenseForm.patchValue({ totalKm: endKm - startKm });
    } else {
      this.expenseForm.patchValue({ totalKm: null }); 
    }
  }

  loadTravelData(): void {
    const state = history.state;
    
    if (state.travelData) {
      this.isEditing = true;
      this.travelId = state.travelData.id_travel; 
      console.error('id travel dans loadTravelData ', this.travelId );
      this.list_mission_expenses = state.travelData.list_expenses;
      localStorage.setItem('id_travel', state.travelData.id_travel);
      console.error('ID Travel mis à jour:', localStorage.getItem('id_travel'));

      const formatDateForInput = (dateString: string) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`; // Convertir en format YYYY-MM-DD
      };
  
      // Pré-remplir le formulaire avec les données existantes
      this.expenseForm.patchValue({
 
        projectCode: state.travelData.project_code ,
        projectName: this.autocompleteProjectName(state.travelData.project_code),
        purpose: state.travelData.purpose,
        startDate: formatDateForInput(state.travelData.start_date.split(' ')[0]),
        startTime: state.travelData.start_date.split(' ')[1],
        startResidence: state.travelData.start_place,
        endDate: formatDateForInput(state.travelData.end_date.split(' ')[0]),
        endTime: state.travelData.end_date.split(' ')[1],
        endResidence: state.travelData.return_place,
        startMunicipality: state.travelData.start_municipality,
        destinationMunicipality: state.travelData.destination,
        returnMunicipality: state.travelData.end_municipality,

        nightMunicipality: state.travelData.night_municipality,
        nightCount: state.travelData.night_count,
        mealCount: state.travelData.meal_count,

        vehicleLicense: state.travelData.license_vehicle,
        vehicleComment: state.travelData.comment_vehicle,
        startKm: state.travelData.start_km,
        endKm: state.travelData.end_km,
     
        comments: state.travelData.comment
      });
      this.savedProjectCode = state.travelData.project_code;
    }
  }

  preventEnterSubmit(event: Event) {
    if (event instanceof KeyboardEvent) {
      const target = event.target as HTMLElement;
  
      // Vérifier que le focus n'est pas sur un bouton
      if (target.tagName !== 'BUTTON') {
        event.preventDefault(); // Empêche la soumission du formulaire
      }
    }
  }

  validateEndDate(): void {
    const startDate = this.expenseForm.get('startDate')?.value;
    const endDate = this.expenseForm.get('endDate')?.value;
  
    if (startDate && endDate) {
      const start = moment(startDate, 'YYYY-MM-DD');
      const end = moment(endDate, 'YYYY-MM-DD');
  
      if (end.isBefore(start)) {
        this.expenseForm.get('endDate')?.setErrors({ invalidEndDate: true });
        this.showToast('Date fin ne doit pas être inférieure à la date de début.', true);
      } else {
        this.expenseForm.get('endDate')?.setErrors(null);
      }
    }
  }
  
  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}

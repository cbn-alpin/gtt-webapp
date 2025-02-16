import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { MunicipalityService } from 'src/app/services/municipality/municipality.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ShareDataService } from 'src/app/services/shareData/share-data.service';

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
  travelId: number | null = null;
  savedProjectCode : any;
  

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
      startResidence: [''],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      endResidence: [''],
      startMunicipality: [''],
      destinationMunicipality: [''],
      returnMunicipality: [''],

      nightMunicipality: [''],
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
      switchMap(value => this.municipalityService.getCommunes(value || ''))
    );
  }
  
  save(): void {
    if (this.expenseForm.valid) {
      const formData = this.expenseForm.value;
      
      const userId = Number(localStorage.getItem('id_user'));

      const travelData = {
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

      if (this.isEditing && this.travelId) {
        this.expenseService.updateUserTravelExpense(this.travelId, userId, travelData).subscribe({
          next: (response) => {
            const createdTravelId = response.id_travel; // Supposons que l'API retourne l'ID
            this.shareDataService.setTravelId(createdTravelId);
            this.shareDataService.validateTravelExpense()
            this.router.navigate(['accueil/liste-frais-de-deplacement/']);
            setTimeout(() => {
              this.showToast(`frais de déplacement mis à jour avec succès. 🎉`);
            }, 100);
;
          },
          error: (err) => this.showToast(`Erreur lors de mise à jour du frais de déplacement.`, true),
        });

      }else{
   
        this.expenseService.createTravelExpense(userId,this.projectId, travelData)
        .subscribe({
          next: () => {
            this.router.navigate(['accueil/liste-frais-de-deplacement/']);
            setTimeout(() => {
              this.showToast(`frais de déplacement créé avec succès. 🎉`);
            }, 100);
          },
          error: (error) => {
            console.log('Erreur lors de la création du frais de déplacement.', error);
            this.showToast(`Erreur lors de la création du frais de déplacement.`, true);
          }
        });
      }
   
    } else {
      console.log('Le formulaire est invalide.');
    }
  }

  formatDate(date: Date | string, timeString?: string): string {
    let parsedDate;
  
    // Vérifier si la date est une chaîne et la convertir
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');
      parsedDate = new Date(`${year}-${month}-${day}`);
    } else {
      parsedDate = new Date(date);
    }
  
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();
  
    if (timeString) {
      return this.isEditing ? `${year}-${month}-${day}` : `${day}/${month}/${year} ${timeString}:00`;
    }
    
    return `${day}/${month}/${year} 00:00:00`; // Ajoute une heure par défaut
  }
  
  
  cancel(): void {
    this.router.navigate(['accueil/liste-frais-de-deplacement/']);
    this.expenseForm.reset();
  }

  calculateTotalKm(): void {
    const startKm = this.expenseForm.get('startKm')!.value;
    const endKm = this.expenseForm.get('endKm')!.value;
  
    if (startKm !== null && endKm !== null && endKm >= startKm) {
      this.expenseForm.patchValue({ totalKm: endKm + startKm });
    } else {
      this.expenseForm.patchValue({ totalKm: null }); 
    }
  }

  loadTravelData(): void {
    const state = history.state;
    
    if (state.travelData) {
      this.isEditing = true;
      this.travelId = state.travelData.id_travel; 

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
  

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}

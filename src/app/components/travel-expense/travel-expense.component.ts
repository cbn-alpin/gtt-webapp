import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { MunicipalityService } from 'src/app/services/municipality/municipality.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';



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
  vehicleOptions = ['Service', 'Personnel', 'Location', 'Covoiturage'];
  residenceOptions = ['Résidence Administrative', 'Résidence Familiale'];
  

  constructor(private fb: FormBuilder, private municipalityService : MunicipalityService, 
    private readonly projectService: ProjectsService, private expenseService: ExpensesService) {

    this.expenseForm = this.fb.group({
      projectCode: ['', Validators.required],
      projectName: [''],
      purpose: [''],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      startResidence: [''],
      endDate: [''],
      endTime: [''],
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

    // Retrieve list projects for auto-completion
    this.projectService.getAllProjects().subscribe({
    next: (projects) => {
      this.projects = projects;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des projets :', error);
    }});

    // listen changements of "code" field
    this.expenseForm.get('projectCode')?.valueChanges.subscribe(value => {
      this.autocompleteProjectName(value);
    });
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
      // map(results => results.map((result: any) => ({
      //   name: result.display_name,
      //   postalCode: result.address.postcode || 'N/A'
      // })))
    );
  }
  
  save(): void {
    if (this.expenseForm.valid) {
      const formData = this.expenseForm.value;
      
      const userId = Number(localStorage.getItem('id_user'));
  
  
      const travelData = {
        start_date: this.formatDate(`${formData.startDate}`, `${formData.startDate}`),
        end_date: this.formatDate(`${formData.endDate}`, `${formData.endDate}`),
        start_place: formData.startResidence,
        return_place: formData.endResidence,
        status: "A Traiter",
        purpose: formData.purpose,
        start_municipality: formData.startMunicipality,
        end_municipality: formData.returnMunicipality,
        destination: formData.destinationMunicipality,
        night_count: formData.nightCount || 0,
        meal_count: formData.mealCount || 0,
        comment: formData.comments,
        license_vehicle: formData.vehicleLicense,
        comment_vehicle: formData.vehicleComment,
        start_km: formData.startKm || 0,
        end_km: formData.endKm || 0
      };
  
      this.expenseService.createTravelExpense(userId,this.projectId, travelData)
      .subscribe({
        next: () => {
          console.log('frais de déplacement créé avec succès.');
        },
        error: (error) => {
          console.log('Erreur lors de la création du frais de déplacement.');
        }
      });
    } else {
      console.log('Le formulaire est invalide.');
    }
  }

  formatDate(dateString: string, timeString?: string) {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    if (timeString) {
      return `${day}/${month}/${year} ${timeString}:00`;
    }
    return `${day}/${month}/${year}`;
  }
  

  cancel(): void {
    this.expenseForm.reset();
  }

}

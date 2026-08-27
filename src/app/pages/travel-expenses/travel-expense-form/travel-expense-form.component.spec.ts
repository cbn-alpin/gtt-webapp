import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { of, Subject } from 'rxjs';

import { ExpensesService } from 'src/app/core/services/expenses/expenses.service';
import { MunicipalityService } from 'src/app/core/services/municipality/municipality.service';
import { ProjectsService } from 'src/app/core/services/projects/projects.service';
import { ShareDataService } from 'src/app/core/services/share-data/share-data.service';
import { TravelExpenseFormComponent } from './travel-expense-form.component';

describe('TravelExpenseFormComponent', () => {
  let component: TravelExpenseFormComponent;
  let fixture: ComponentFixture<TravelExpenseFormComponent>;

  const mockTravelData = {
    travelData: {
      id_travel: 12,
      project_code: 'CODE-TEST',
      purpose: 'Réunion partenaire',
      start_date: '10/06/2024 09:00',
      end_date: '10/06/2024 18:00',
      start_place: 'Résidence Administrative',
      return_place: 'Résidence Administrative',
      start_municipality: 'Gap (05000)',
      destination: 'Briançon (05100)',
      end_municipality: 'Gap (05000)',
      night_municipality: 'Briançon (05100)',
      night_count: 0,
      meal_count: 1,
      license_vehicle: 'Service',
      comment_vehicle: '',
      start_km: 50,
      end_km: 150,
      comment: '',
      list_expenses: [],
    },
  };

  const mockMunicipalityService = {
    getCommunes: jasmine.createSpy('getCommunes').and.returnValue(of([])),
  };
  const mockProjectService = {
    getAllProjects: jasmine.createSpy('getAllProjects').and.returnValue(of([])),
  };
  const mockExpenseService = {
    createTravelExpense: jasmine.createSpy('createTravelExpense'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
  const mockShareDataService = {
    sendTravelId: jasmine.createSpy('sendTravelId'),
    validateTravelExpense: jasmine.createSpy('validateTravelExpense'),
    missionExpensesProcessed$: new Subject<boolean>().asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      declarations: [TravelExpenseFormComponent],
      providers: [
        { provide: MunicipalityService, useValue: mockMunicipalityService },
        { provide: ProjectsService, useValue: mockProjectService },
        { provide: ExpensesService, useValue: mockExpenseService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ShareDataService, useValue: mockShareDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not prefill form when history.state has no travelData (creation mode)', () => {
    spyOnProperty(history, 'state', 'get').and.returnValue({});

    fixture = TestBed.createComponent(TravelExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditing).toBeFalse();
    expect(component.expenseForm.get('purpose')?.value).toBe('');
  });

  it('should prefill form when travelData is present in history.state (edit mode)', () => {
    spyOnProperty(history, 'state', 'get').and.returnValue(mockTravelData);

    fixture = TestBed.createComponent(TravelExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditing).toBeTrue();
    expect(component.travelId).toBe(12);
    expect(component.expenseForm.get('purpose')?.value).toBe('Réunion partenaire');
    expect(component.expenseForm.get('startDate')?.value).toBe('2024-06-10');
  });
});

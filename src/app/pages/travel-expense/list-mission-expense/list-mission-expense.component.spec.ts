import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of, Subject } from 'rxjs';

import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ShareDataService } from 'src/app/services/share-data/share-data.service';
import { ListMissionExpenseComponent } from './list-mission-expense.component';

describe('ListMissionExpenseComponent', () => {
  let component: ListMissionExpenseComponent;
  let fixture: ComponentFixture<ListMissionExpenseComponent>;

  const travelExpenseValidatedSubject = new Subject<void>();
  const newTravelIdSubject = new Subject<number>();

  const mockDialog = {
    open: jasmine.createSpy('open'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };
  const mockExpensesService = {
    createMissionExpense: jasmine.createSpy('createMissionExpense'),
    updateMissionExpense: jasmine.createSpy('updateMissionExpense'),
    deleteMissionExpense: jasmine.createSpy('deleteMissionExpense'),
  };
  const mockShareDataService = {
    travelExpenseValidated$: travelExpenseValidatedSubject.asObservable(),
    newTravelId$: newTravelIdSubject.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMissionExpenseComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: ShareDataService, useValue: mockShareDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMissionExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

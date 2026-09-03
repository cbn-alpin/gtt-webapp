import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ShareDataService } from 'src/app/services/share-data/share-data.service';
import { ListTravelExpenseComponent } from './list-travel-expense.component';

describe('ListTravelExpenseComponent', () => {
  let component: ListTravelExpenseComponent;
  let fixture: ComponentFixture<ListTravelExpenseComponent>;

  const mockDialog = {
    open: jasmine.createSpy('open'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };
  const mockExpensesService = {
    getUserAllTravelsExpenses: jasmine
      .createSpy('getUserAllTravelsExpenses')
      .and.returnValue(of([])),
  };
  const mockShareDataService = {
    sendTravelId: jasmine.createSpy('sendTravelId'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTravelExpenseComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: ShareDataService, useValue: mockShareDataService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListTravelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

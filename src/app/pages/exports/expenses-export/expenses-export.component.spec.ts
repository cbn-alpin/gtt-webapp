import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { DownloadService } from 'src/app/core/services/download/download.service';
import { ExpensesService } from 'src/app/core/services/expenses/expenses.service';
import { ShareDataService } from 'src/app/core/services/share-data/share-data.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ExpensesExportComponent } from './expenses-export.component';

describe('ExpensesExportComponent', () => {
  let component: ExpensesExportComponent;
  let fixture: ComponentFixture<ExpensesExportComponent>;
  const mockUserService = {
    getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(of([])),
  };
  const mockDownloadService = {
    downloadCSV: jasmine.createSpy('downloadCSV'),
  };
  const mockExpensesService = {
    getExpenses: jasmine.createSpy('getExpenses'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };
  const mockShareDateService = {
    formatDate: jasmine.createSpy('formatDate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesExportComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ShareDataService, useValue: mockShareDateService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

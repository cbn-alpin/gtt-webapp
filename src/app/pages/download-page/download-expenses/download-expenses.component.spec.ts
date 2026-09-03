import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { DownloadService } from 'src/app/services/download/download.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ShareDataService } from 'src/app/services/share-data/share-data.service';
import { UserService } from 'src/app/services/user/user.service';
import { DownloadExpensesComponent } from './download-expenses.component';

describe('DownloadExpensesComponent', () => {
  let component: DownloadExpensesComponent;
  let fixture: ComponentFixture<DownloadExpensesComponent>;
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
      declarations: [DownloadExpensesComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ShareDataService, useValue: mockShareDateService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

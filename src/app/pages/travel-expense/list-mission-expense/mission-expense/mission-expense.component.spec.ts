import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { ShareDataService } from 'src/app/services/share-data/share-data.service';
import { MissionExpenseComponent } from './mission-expense.component';

describe('MissionExpenseComponent', () => {
  let component: MissionExpenseComponent;
  let fixture: ComponentFixture<MissionExpenseComponent>;

  const newTravelIdSubject = new Subject<number>();

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };
  const mockData = { id_travel: 1, expense: {} };
  const mockShareDataService = {
    newTravelId$: newTravelIdSubject.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MissionExpenseComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { prodivde: ShareDataService, useValue: mockShareDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

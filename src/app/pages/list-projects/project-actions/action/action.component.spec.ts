import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProjectActionsService } from 'src/app/services/project-actions/project-actions.service';
import { ActionComponent } from './action.component';

describe('ActionComponent', () => {
  let component: ActionComponent;
  let fixture: ComponentFixture<ActionComponent>;

  const mockDialogData = {
    id_project: 1,
  };

  const mockProjectActionService = {
    updateActionById: jasmine.createSpy('updateActionById'),
    createProjectAction: jasmine.createSpy('createProjectAction'),
  };
  const mockMatDialogRef = {
    close: jasmine.createSpy('close'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ProjectActionsService, useValue: mockProjectActionService },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

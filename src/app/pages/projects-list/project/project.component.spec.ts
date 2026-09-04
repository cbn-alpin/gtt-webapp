import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { ProjectsService } from 'src/app/core/services/projects/projects.service';
import { ProjectComponent } from './project.component';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  const mockData = { project: {} };
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };
  const mockProjectService = {
    createProject: jasmine.createSpy('createProject'),
    getGefiprojAllProjects: jasmine.createSpy('getGefiprojAllProjects').and.returnValue(of([])),
    updateProjectById: jasmine.createSpy('updateProjectById'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectComponent, ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ProjectsService, useValue: mockProjectService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

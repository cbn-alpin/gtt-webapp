import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { ProjectActionsService } from 'src/app/core/services/project-actions/project-actions.service';
import { ProjectsService } from 'src/app/core/services/projects/projects.service';
import { UserActionService } from 'src/app/core/services/user-action/user-action.service';
import { ProjectActionsComponent } from './project-actions.component';

describe('ProjectActionsComponent', () => {
  let component: ProjectActionsComponent;
  let fixture: ComponentFixture<ProjectActionsComponent>;

  const mockUserActionService = {
    createUserAction: jasmine.createSpy('createUserAction'),
    deleteUserAction: jasmine.createSpy('deleteUserAction'),
  };
  const mockProjectService = {
    getProjectById: jasmine.createSpy('getProjectById').and.returnValue(of([])),
  };
  const mockProjectActionService = {
    getUserProjects: jasmine.createSpy('getUserProjects'),
    deleteActionById: jasmine.createSpy('deleteActionById'),
  };
  const mockDialog = {
    close: jasmine.createSpy('close'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectActionsComponent],
      providers: [
        { provide: UserActionService, useValue: mockUserActionService },
        { provide: ProjectsService, useValue: mockProjectService },
        { provide: ProjectActionsService, useValue: mockProjectActionService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

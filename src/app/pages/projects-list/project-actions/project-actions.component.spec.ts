import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of, throwError } from 'rxjs';

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
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    mockUserActionService.createUserAction.calls.reset();
    mockUserActionService.deleteUserAction.calls.reset();
    mockProjectService.getProjectById.calls.reset();
    mockProjectActionService.getUserProjects.calls.reset();
    mockDialog.open.calls.reset();
    mockProjectService.getProjectById.and.returnValue(of({ id_project: 1, list_action: [] }));
    mockProjectActionService.getUserProjects.and.returnValue(of([]));
    mockDialog.open.and.returnValue({
      afterClosed: () => of(true),
    });

    await TestBed.configureTestingModule({
      imports: [ProjectActionsComponent],
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

  describe('deleteActionById()', () => {
    beforeEach(() => {
      mockProjectActionService.deleteActionById.calls.reset();
      mockDialog.open.calls.reset();
      mockSnackBar.open.calls.reset();
    });

    it('should confirm and delete the action when user confirms', () => {
      const deleteSpy = mockProjectActionService.deleteActionById.and.returnValue(of(undefined));

      component.deleteActionById('Tester l’action', 42);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith(42);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '✅ Action supprimée avec succès',
        '',
        jasmine.any(Object)
      );
    });

    it('should show an error toast when deletion fails', () => {
      mockProjectActionService.deleteActionById.and.returnValue(
        throwError(() => ({ error: { message: 'Suppression impossible' } }))
      );

      component.deleteActionById('Tester l’action', 42);

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '❌ Erreur : Suppression impossible',
        '',
        jasmine.any(Object)
      );
    });
  });
});

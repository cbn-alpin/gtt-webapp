import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';



import { of, throwError } from 'rxjs';



import { ProjectsService } from 'src/app/core/services/projects/projects.service';
import { ProjectsListComponent } from './projects-list.component';

describe('ProjectsListComponent', () => {
  let component: ProjectsListComponent;
  let fixture: ComponentFixture<ProjectsListComponent>;

  const mockDialog = {
    open: jasmine.createSpy('open'),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };
  const mockProjectService = {
    getAllProjects: jasmine.createSpy('getAllProjects').and.returnValue(of([])),
    deleteProjectById: jasmine.createSpy('deleteProjectById').and.returnValue(of({})),
  };

  beforeEach(async () => {
    mockDialog.open.calls.reset();
    mockSnackBar.open.calls.reset();
    mockProjectService.getAllProjects.calls.reset();
    mockProjectService.deleteProjectById.calls.reset();
    mockProjectService.getAllProjects.and.returnValue(of([]));
    mockProjectService.deleteProjectById.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ProjectsListComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ProjectsService, useValue: mockProjectService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteProjectById()', () => {
    it('should delete the project when the confirmation is accepted', () => {
      const dialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true)),
      };
      mockDialog.open.and.returnValue(dialogRef);

      component.deleteProjectById('Supprimer', 42);

      expect(mockDialog.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          disableClose: true,
          width: '300px',
          data: { message: 'Supprimer?' },
        })
      );
      expect(mockProjectService.deleteProjectById).toHaveBeenCalledWith(42);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '✅ Projet supprimé avec succès',
        '',
        jasmine.objectContaining({ duration: 5000 })
      );
    });

    it('should not delete the project when the confirmation is canceled', () => {
      const dialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(false)),
      };
      mockDialog.open.and.returnValue(dialogRef);

      component.deleteProjectById('Supprimer', 42);

      expect(mockProjectService.deleteProjectById).not.toHaveBeenCalled();
      expect(mockSnackBar.open).not.toHaveBeenCalled();
    });

    it('should show an error message when the delete request fails', () => {
      const dialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true)),
      };
      mockDialog.open.and.returnValue(dialogRef);
      mockProjectService.deleteProjectById.and.returnValue(
        throwError(() => ({ error: { message: 'Erreur serveur' } }))
      );

      component.deleteProjectById('Supprimer', 42);

      expect(mockProjectService.deleteProjectById).toHaveBeenCalledWith(42);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '❌ Erreur : Erreur serveur',
        '',
        jasmine.objectContaining({ duration: 5000, panelClass: 'error-toast' })
      );
    });
  });
});
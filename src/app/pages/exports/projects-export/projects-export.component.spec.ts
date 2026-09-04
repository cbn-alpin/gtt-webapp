import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { DownloadService } from 'src/app/core/services/download/download.service';
import { ProjectsService } from 'src/app/core/services/projects/projects.service';
import { ProjectsExportComponent } from './projects-export.component';

describe('ProjectsExportComponent', () => {
  let component: ProjectsExportComponent;
  let fixture: ComponentFixture<ProjectsExportComponent>;

  const mockDownloadService = {
    downloadCSV: jasmine.createSpy('downloadCSV'),
  };
  const mockProjectService = {
    getAllProjects: jasmine.createSpy('getAllProjects').and.returnValue(of([])),
    getProjectActionsAndUsersTimesById: jasmine
      .createSpy('getProjectActionsAndUsersTimesById')
      .and.returnValue(of({ time_entries: [] })),
  };
  const mockSnackBar = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsExportComponent],
      providers: [
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ProjectsService, useValue: mockProjectService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

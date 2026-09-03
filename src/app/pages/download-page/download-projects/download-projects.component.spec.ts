import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { DownloadService } from 'src/app/services/download/download.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { DownloadProjectsComponent } from './download-projects.component';

describe('DownloadProjectsComponent', () => {
  let component: DownloadProjectsComponent;
  let fixture: ComponentFixture<DownloadProjectsComponent>;

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
      declarations: [DownloadProjectsComponent],
      providers: [
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ProjectsService, useValue: mockProjectService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

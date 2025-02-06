import { TestBed } from '@angular/core/testing';

import { ProjectActionsService } from './project-actions.service';

describe('ProjectActionsService', () => {
  let service: ProjectActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

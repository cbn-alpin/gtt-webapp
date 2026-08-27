import { TestBed } from '@angular/core/testing';

import { TimeStateService } from './time-state-service.service';

describe('TimeStateService', () => {
  let service: TimeStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

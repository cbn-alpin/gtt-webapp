import { TestBed } from '@angular/core/testing';

import { TimeStateServiceService } from './time-state-service.service';

describe('TimeStateServiceService', () => {
  let service: TimeStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

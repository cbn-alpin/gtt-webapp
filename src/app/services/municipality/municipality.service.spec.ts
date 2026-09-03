import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MunicipalityService } from './municipality.service';

describe('MunicipalityService', () => {
  let service: MunicipalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MunicipalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

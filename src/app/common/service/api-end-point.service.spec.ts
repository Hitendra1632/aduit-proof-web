import { TestBed } from '@angular/core/testing';

import { ApiEndPointService } from './api-end-point.service';

describe('ApiEndPointService', () => {
  let service: ApiEndPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiEndPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

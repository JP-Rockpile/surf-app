import { TestBed } from '@angular/core/testing';

import { StormGlassAPIService } from './storm-glass-api.service';

describe('StormGlassAPIService', () => {
  let service: StormGlassAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StormGlassAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

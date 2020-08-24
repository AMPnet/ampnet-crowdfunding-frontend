import { TestBed } from '@angular/core/testing';

import { OffersFilterServiceService } from './offers-filter-service.service';

describe('OfficeFilterServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffersFilterServiceService = TestBed.get(OffersFilterServiceService);
    expect(service).toBeTruthy();
  });
});

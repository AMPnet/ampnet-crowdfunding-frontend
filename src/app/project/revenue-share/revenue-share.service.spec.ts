import { TestBed } from '@angular/core/testing';

import { RevenueShareService } from './revenue-share.service';

describe('RevenueShareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RevenueShareService = TestBed.get(RevenueShareService);
    expect(service).toBeTruthy();
  });
});

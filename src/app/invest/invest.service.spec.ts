import { TestBed } from '@angular/core/testing';

import { InvestService } from './invest.service';

describe('InvestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvestService = TestBed.get(InvestService);
    expect(service).toBeTruthy();
  });
});

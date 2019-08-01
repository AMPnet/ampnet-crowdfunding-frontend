import { TestBed } from '@angular/core/testing';

import { DepositServiceService } from './deposit-service.service';

describe('DepositServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepositServiceService = TestBed.get(DepositServiceService);
    expect(service).toBeTruthy();
  });
});

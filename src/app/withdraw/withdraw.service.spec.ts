import { TestBed } from '@angular/core/testing';

import { WithdrawService } from './withdraw.service';

describe('WithdrawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WithdrawService = TestBed.get(WithdrawService);
    expect(service).toBeTruthy();
  });
});

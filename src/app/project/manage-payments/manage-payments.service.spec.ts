import { TestBed } from '@angular/core/testing';

import { ManagePaymentsService } from './manage-payments.service';

describe('RevenueShareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagePaymentsService = TestBed.get(ManagePaymentsService);
    expect(service).toBeTruthy();
  });
});

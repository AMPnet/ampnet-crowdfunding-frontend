import { TestBed } from '@angular/core/testing';

import { IssuingAuthorityService } from './issuing-authority.service';

describe('IssuingAuthorityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssuingAuthorityService = TestBed.get(IssuingAuthorityService);
    expect(service).toBeTruthy();
  });
});

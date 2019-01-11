import { TestBed } from '@angular/core/testing';

import { FillDataService } from './fill-data.service';

describe('FillDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FillDataService = TestBed.get(FillDataService);
    expect(service).toBeTruthy();
  });
});

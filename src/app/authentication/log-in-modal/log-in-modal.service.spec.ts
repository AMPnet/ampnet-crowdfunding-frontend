import { TestBed } from '@angular/core/testing';

import { LogInModalService } from './log-in-modal.service';

describe('LogInModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogInModalService = TestBed.get(LogInModalService);
    expect(service).toBeTruthy();
  });
});

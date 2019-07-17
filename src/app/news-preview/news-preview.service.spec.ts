import { TestBed } from '@angular/core/testing';

import { NewsPreviewService } from './news-preview.service';

describe('NewsPreviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewsPreviewService = TestBed.get(NewsPreviewService);
    expect(service).toBeTruthy();
  });
});

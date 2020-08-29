import { TestBed } from '@angular/core/testing';
import { LinkPreview, NewsPreviewService } from './news-preview.service';
import { BackendHttpClient } from './backend-http-client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('NewsPreviewService', () => {
    let http: jasmine.SpyObj<BackendHttpClient>;
    let newsPreviewService: NewsPreviewService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BackendHttpClient, NewsPreviewService],
        });

        http = TestBed.inject(BackendHttpClient) as jasmine.SpyObj<BackendHttpClient>;
        newsPreviewService = TestBed.inject(NewsPreviewService);
    });

    describe('getLinkPreview', () => {
        it('should return preview data for given URL', () => {
            const mockLinkPreviewData = <LinkPreview>{
                title: 'Link Title',
                description: 'Link description',
                image: {
                    url: 'https://google.com',
                    height: '120',
                    width: '120'
                },
                url: 'https://test-url.google.com'
            };

            // TODO: investigate why this approach doesn't work.
            // http.get.and.returnValue(of(mockLinkPreviewData));

            spyOn(http, 'get').and.returnValue(of(mockLinkPreviewData));

            newsPreviewService.getLinkPreview('url').subscribe(res => {
                expect(res).toEqual(mockLinkPreviewData);
            });
        });
    });
});

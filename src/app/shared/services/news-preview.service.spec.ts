import { TestBed } from '@angular/core/testing';
import { LinkPreview, NewsPreviewService } from './news-preview.service';
import { BackendHttpClient } from './backend-http-client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../shared.module';
import { AppConfigService } from './app-config.service';

describe('NewsPreviewService', () => {
    let http: jasmine.SpyObj<BackendHttpClient>;
    let newsPreviewService: NewsPreviewService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot(),
                HttpClientTestingModule,
                SharedModule
            ],
            providers: [NewsPreviewService, AppConfigService],
        });

        http = TestBed.inject(BackendHttpClient) as jasmine.SpyObj<BackendHttpClient>;
        newsPreviewService = TestBed.inject(NewsPreviewService);
    });

    describe('getLinkPreview', () => {
        it('should return preview data for given URL', () => {
            const mockLinkPreviewData = <LinkPreview>{
                open_graph: {
                    title: 'Link Title',
                    description: 'Link description',
                    image: {
                        url: 'https://google.com',
                        height: '120',
                        width: '120'
                    }
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

import { Component } from '@angular/core';
import { AppConfigService } from '../shared/services/app-config.service';
import { SummaryService } from '../shared/services/summary.service';
import { displayBackendErrorRx } from '../utilities/error-handler';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
    summary$ = this.summaryService.getBlockchainMiddlewareData().pipe(
        displayBackendErrorRx()
    );

    constructor(public appConfig: AppConfigService,
                private summaryService: SummaryService) {
    }
}

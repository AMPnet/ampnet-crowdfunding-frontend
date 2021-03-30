import { Component } from '@angular/core';
import { AppConfigService } from '../shared/services/app-config.service';
import { SummaryService } from '../shared/services/summary.service';
import { ErrorService } from '../shared/services/error.service';
import { enterTrigger } from '../shared/animations';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    animations: [enterTrigger]
})
export class LandingPageComponent {
    summary$ = this.summaryService.getBlockchainMiddlewareData().pipe(
        this.errorService.handleError
    );

    constructor(public appConfig: AppConfigService,
                private errorService: ErrorService,
                private summaryService: SummaryService) {
    }
}

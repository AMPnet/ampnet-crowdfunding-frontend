import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../shared/services/app-config.service';
import { SummaryService } from '../shared/services/summary.service';
import { enterTrigger } from '../shared/animations';
import { RouterService } from '../shared/services/router.service';
import { JwtTokenService } from '../shared/services/jwt-token.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    animations: [enterTrigger]
})
export class LandingPageComponent implements OnInit {
    summary$ = this.summaryService.getBlockchainMiddlewareData();

    constructor(public appConfig: AppConfigService,
                private jwtTokenService: JwtTokenService,
                private router: RouterService,
                private summaryService: SummaryService) {
    }

    ngOnInit() {
        // TODO: Dirty fix for dedicated hostname routing issue.
        if (this.jwtTokenService.isLoggedIn()) {
            this.router.navigate(['/dash']);
        }
    }
}

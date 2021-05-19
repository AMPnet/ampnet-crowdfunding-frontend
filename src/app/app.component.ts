import { Component, Inject, OnInit } from '@angular/core';
import { AppConfigService } from './shared/services/app-config.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { GoogleAnalyticsService } from './shared/services/google-analytics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private appConfigService: AppConfigService,
                @Inject(DOCUMENT) private document: HTMLDocument,
                private gaService: GoogleAnalyticsService,
                private title: Title) {
    }

    ngOnInit() {
        this.appConfigService.config$.subscribe(configRes => {
            this.title.setTitle(configRes.config.title);
            this.document.getElementById('appFavicon')
                .setAttribute('href', configRes.config.icon_url);
        });
        this.gaService.setTag();
    }
}

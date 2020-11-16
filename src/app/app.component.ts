import { Component, Inject, OnInit } from '@angular/core';
import { AppConfigService } from './shared/services/app-config.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

declare var WOW: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private appConfigService: AppConfigService,
                @Inject(DOCUMENT) private document: HTMLDocument,
                private title: Title) {
    }

    ngOnInit() {
        new WOW().init();

        this.appConfigService.config$.subscribe(configRes => {
            this.title.setTitle(configRes.config.title);
            this.document.getElementById('appFavicon')
                .setAttribute('href', configRes.config.icon_url);
        });
    }
}

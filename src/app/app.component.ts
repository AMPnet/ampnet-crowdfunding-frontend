import { Component, Inject, OnInit } from '@angular/core';
import { AppConfigService } from './shared/services/app-config.service';
import { Meta, Title } from '@angular/platform-browser';
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

        this.title.setTitle(this.appConfigService.config.customConfig.title);
        this.document.getElementById('appFavicon')
            .setAttribute('href', this.appConfigService.config.customConfig.icon_url);
    }
}

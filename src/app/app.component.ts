import { Component, OnInit } from '@angular/core';
import { AppConfigService } from './shared/services/app-config.service';
import { Meta, Title } from '@angular/platform-browser';

declare var WOW: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private appConfigService: AppConfigService,
                private title: Title) {
    }

    ngOnInit() {
        new WOW().init();

        this.title.setTitle(this.appConfigService.config.title);
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-static-page',
    templateUrl: './static-page.component.html',
    styleUrls: ['./static-page.component.css']
})
export class StaticPageComponent implements OnInit {
    staticPage = StaticPage;
    page: StaticPage;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.page = this.route.snapshot.params.page;
    }
}

export enum StaticPage {
    TOS = 'tos',
    PRIVACY = 'privacy',
    COOKIES = 'cookies',
}

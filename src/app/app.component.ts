import { Component, OnInit } from '@angular/core';

declare var WOW: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'AMPnet';

    constructor() {
    }

    ngOnInit() {
        new WOW().init();

    }
}

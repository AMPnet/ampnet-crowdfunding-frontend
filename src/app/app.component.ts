import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var WOW: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'AMPnet';

    constructor(private router: Router) {
    }

    ngOnInit() {
        new WOW().init();

    }
}

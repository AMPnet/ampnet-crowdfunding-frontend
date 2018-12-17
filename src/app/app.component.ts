import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router, NavigationEnd } from '@angular/router';
import { Spinner } from 'spin.js';

declare var WOW: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AMPnet';

  constructor(private router: Router) { }

  ngOnInit() {
    new WOW().init();
  }
}

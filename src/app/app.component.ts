import { Component } from '@angular/core';
import * as $ from "jquery";
import { Router, NavigationEnd } from '@angular/router';

declare var feather: any;
declare var WOW: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AMPnet';

  constructor(private router: Router) { }

  ngOnInit() {
  	feather.replace()
  	new WOW().init();

  }
}

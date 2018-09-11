import { Component } from '@angular/core';
import * as $ from "jquery";

declare var feather: any;
declare var WOW: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AMPnet';

  ngOnInit() {
  	feather.replace()
  	new WOW().init();
  }
}

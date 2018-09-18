import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router, NavigationEnd } from '@angular/router';

declare var feather: any;
declare var WOW: any;

@Component({
  selector: 'app-dashboard-holder',
  templateUrl: './dashboard-holder.component.html',
  styleUrls: ['./dashboard-holder.component.css']
})
export class DashboardHolderComponent implements OnInit {
  title = 'AMPnet';

  constructor(private router: Router) { }

  ngOnInit() {
    feather.replace();
    new WOW().init();
  }
}

import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  menuButtonClicked() {
  	console.log("in here");

  	var sidebar = $(".sidebar-fixer");

  	if(sidebar.position().left < 0) {
			sidebar.animate({
				left: 0
			}, 100)
  	} else {
  		sidebar.animate({
  			left: "-240px"
  		}, 100);
  	}
  }

}

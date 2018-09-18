import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	$("#main-menu li").on('click', () => {

  	});
  }

  logOutClicked() {
  	window.location.href = "http://ampnet.io";
  }

  contactUsClicked() {
  	window.location.href = "mailto://info@ampnet.io";
  }

}

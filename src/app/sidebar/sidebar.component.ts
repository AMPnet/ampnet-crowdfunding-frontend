import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#main-menu li').on('click', () => {
      NavbarComponent.toggleSidebar(false);
    });
  }

  logOutClicked() {
    window.location.href = 'http://ampnet.io';
  }

  contactUsClicked() {
    window.location.href = 'mailto://info@ampnet.io';
  }

}

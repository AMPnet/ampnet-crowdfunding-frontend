import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    $('#main-menu li').on('click', () => {
      NavbarComponent.toggleSidebar(false);
    });
  }

  logOutClicked() {
    this.router.navigate(['/']);
  }

  contactUsClicked() {
    window.location.href = 'mailto://info@ampnet.io';
  }

}

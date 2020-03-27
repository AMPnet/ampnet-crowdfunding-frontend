import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import { UserService } from '../user-utils/user-service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isAdmin: boolean
  hasWalletActive: boolean = true
  hasBankingInfo: boolean = true
  hasVerifiedProfile: boolean = true

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    $('#main-menu li').on('click', () => {
      NavbarComponent.toggleSidebar(false);
    });
    this.getProfile()
  }

  getProfile() {
    SpinnerUtil.showSpinner()
    this.userService.getOwnProfile().subscribe((res: any) => {
      this.isAdmin = (res.role == 'ADMIN')
    }, hideSpinnerAndDisplayError)
  }

  logOutClicked() {
    localStorage.removeItem('access_token');
    this.router.navigate(['']);
  }

  contactUsClicked() {
    window.location.href = 'mailto://info@ampnet.io';
  }

}

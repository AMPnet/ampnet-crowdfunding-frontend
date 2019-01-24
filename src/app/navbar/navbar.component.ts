import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UserService } from '../user-utils/user-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  sidebar: JQuery;

  fullName: string;

  public static toggleSidebar(toVisible: boolean) {

    const sidebar = $('.sidebar-fixer');
    const navbar = $('.navbar');

    if (toVisible) {
     sidebar.animate({
       left: 0
     }, 100);
     navbar.animate({
       'margin-left' : '220px'
     }, 150);
    } else {
      sidebar.animate({
        left: '-240px'
      }, 100);
      navbar.animate({
        'margin-left': '0px'
      }, 100);
    }
  }

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    this.userService.getOwnProfile().subscribe(res => {
      this.fullName = res['first_name'] + ' ' + res['last_name'];
    }, err => {

    });
  }

  menuButtonClicked() {
    console.log('in here');

    this.sidebar = $('.sidebar-fixer');

    NavbarComponent.toggleSidebar(this.sidebar.position().left < 0);
  }
}

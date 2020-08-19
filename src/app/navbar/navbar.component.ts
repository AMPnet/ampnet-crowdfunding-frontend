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

    constructor(private userService: UserService) {
    }

    public static toggleSidebar(toVisible: boolean) {

        const sidebar = $('.sidebar-fixer');
        const navbar = $('.navbar');

        if (toVisible) {
            sidebar.animate({
                left: 0
            });

        } else {
            sidebar.animate({
                left: '-240px'
            });

        }
    }

    ngOnInit() {
    }

    menuButtonClicked() {
        this.sidebar = $('.sidebar-fixer');

        NavbarComponent.toggleSidebar(this.sidebar.position().left < 0);
    }
}

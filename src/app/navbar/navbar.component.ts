import { Component } from '@angular/core';
import * as $ from 'jquery';
import { sidebarWidth } from '../utilities/app-const';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    sidebar: JQuery;

    public static toggleSidebar(toVisible: boolean) {
        const sidebar = $('.sidebar-fixer');

        if (toVisible) {
            sidebar.animate({
                left: 0
            });

        } else {
            sidebar.animate({
                left: sidebarWidth
            });
        }
    }

    menuButtonClicked() {
        this.sidebar = $('.sidebar-fixer');
        NavbarComponent.toggleSidebar(this.sidebar.position().left < 0);
    }
}

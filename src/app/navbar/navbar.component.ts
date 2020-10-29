import { Component } from '@angular/core';
import * as $ from 'jquery';

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
            sidebar.css('left', '0px');
        } else {
            sidebar.css('left', '-220px');
        }
    }

    menuButtonClicked() {
        this.sidebar = $('.sidebar-fixer');
        NavbarComponent.toggleSidebar(this.sidebar.css('left') !== '0px');
    }
}

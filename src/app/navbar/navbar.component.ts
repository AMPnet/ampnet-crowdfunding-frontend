import { Component } from '@angular/core';
import * as $ from 'jquery';
import { AppConfigService } from '../shared/services/app-config.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    sidebar: JQuery;

    constructor(public appConfigService: AppConfigService) {
    }
    public static toggleSidebar(toVisible: boolean) {
        const sidebar = $('.sidebar-fixer');

        if (toVisible) {
            sidebar.css('left', '0px');
        } else {
            sidebar.css('left', '-220px');
        }
    }

    public static closeSideBar() {
        const sidebar = $('.sidebar-fixer');
        if (sidebar.css('left') === '0px') {
            sidebar.css('left', '-220px');
        }
    }

    menuButtonClicked() {
        this.sidebar = $('.sidebar-fixer');
        NavbarComponent.toggleSidebar(this.sidebar.css('left') !== '0px');
    }
}

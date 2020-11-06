import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { AppConfigService } from '../../shared/services/app-config.service';

declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

    @Input() onlyLogo = false;

    constructor(private location: PlatformLocation,
                public appConfigService: AppConfigService) {
    }

    ngOnInit() {
        this.location.onPopState(() => $('#log-in-modal').modal('hide'));
    }

    ngAfterViewInit() {
    }

    showLoginModal() {
        history.pushState(null, 'modalOpened');
        $('#log-in-modal').modal('show');
    }
}

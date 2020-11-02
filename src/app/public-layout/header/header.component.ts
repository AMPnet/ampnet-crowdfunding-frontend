import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from '../../shared/services/app-config.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
    @Input() onlyLogo = false;

    constructor(public appConfigService: AppConfigService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
}

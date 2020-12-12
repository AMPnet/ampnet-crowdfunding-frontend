import { Component, Input } from '@angular/core';
import { AppConfigService } from '../../shared/services/app-config.service';

declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Input() onlyLogo = false;

    constructor(public appConfigService: AppConfigService) {
    }
}

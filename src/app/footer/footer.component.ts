import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../shared/services/app-config.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    constructor(public appConfig: AppConfigService) {
    }

    ngOnInit() {
    }
}

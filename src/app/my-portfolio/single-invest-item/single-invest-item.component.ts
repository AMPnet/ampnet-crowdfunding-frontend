import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Portfolio } from '../../shared/services/wallet/portfolio.service';

@Component({
    selector: 'app-single-invest-item',
    templateUrl: './single-invest-item.component.html',
    styleUrls: ['./single-invest-item.component.css']
})
export class SingleInvestItemComponent {
    @Input() investment: Portfolio;

    constructor(private router: Router) {
    }

    onClickedItem() {
        this.router.navigate(['dash', 'my_portfolio', this.investment.project.uuid, 'in_portfolio']);
    }

    getImageAsURL() {
        return `url(${(<any>this.investment.project).image_url})`;
    }
}

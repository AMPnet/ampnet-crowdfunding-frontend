import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Portfolio } from '../../shared/services/wallet/portfolio.service';

@Component({
    selector: 'app-single-invest-item',
    templateUrl: './single-invest-item.component.html',
    styleUrls: ['./single-invest-item.component.scss']
})
export class SingleInvestItemComponent {
    @Input() investment: Portfolio;

    constructor(private router: Router) {
        console.log(this.investment);
    }

    onClickedItem() {
        this.router.navigate(['dash', 'my_portfolio', this.investment.project.uuid, 'in_portfolio'],
        {state: {data: this.investment}});
    }

    // Todo: Remove this if not needed (image that was showing on portfolio single item as bg)
    getImageAsURL() {
        return `url(${(<any>this.investment.project).image_url})`;
    }
}

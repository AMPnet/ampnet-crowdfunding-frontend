import { Component, Input } from '@angular/core';
import { Portfolio } from '../../shared/services/wallet/portfolio.service';
import { RouterService } from '../../shared/services/router.service';

@Component({
    selector: 'app-single-invest-item',
    templateUrl: './single-invest-item.component.html',
    styleUrls: ['./single-invest-item.component.scss']
})
export class SingleInvestItemComponent {
    @Input() investment: Portfolio;

    constructor(private router: RouterService) {
    }

    onClickedItem() {
        this.router.navigate(['/dash', 'my_portfolio', this.investment.project.uuid, 'in_portfolio'],
            {state: {data: this.investment}});
    }
}

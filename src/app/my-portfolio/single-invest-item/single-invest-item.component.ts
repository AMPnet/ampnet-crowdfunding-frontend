import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { centsToBaseCurrencyUnit, prettyCurrency } from 'src/app/utilities/currency-util';
import { Portfolio } from '../../shared/services/wallet/portfolio.service';

@Component({
    selector: 'app-single-invest-item',
    templateUrl: './single-invest-item.component.html',
    styleUrls: ['./single-invest-item.component.css']
})
export class SingleInvestItemComponent implements OnInit {
    @Input() investment: Portfolio;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.investment.project.currency = prettyCurrency(this.investment.project.currency);
        this.investment.investment = centsToBaseCurrencyUnit(this.investment.investment);
    }

    onClickedItem() {
        this.router.navigate(['dash', 'my_portfolio', this.investment.project.uuid, 'in_portfolio']);
    }

    getImageAsURL() {
        return `url(${(<any>this.investment.project).image_url})`;
    }
}

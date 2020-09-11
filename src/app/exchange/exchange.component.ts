import { Component, OnInit } from '@angular/core';
import 'bootstrap-select';
import { Portfolio, PortfolioService } from '../shared/services/wallet/portfolio.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import numeral from 'numeral';

@Component({
    selector: 'app-exchange',
    templateUrl: './exchange.component.html',
    styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {

    portfolio: Portfolio[];
    selectedProjectIndex = -1;
    remainingShares: number;
    personalShares: number;
    totalShares: number;
    sharesForSale: number;
    pricePaidFor: number;
    suggestedSalePrice: number;

    constructor(private portfolioService: PortfolioService) {
    }

    ngOnInit() {
        SpinnerUtil.showSpinner();

        this.portfolioService.getPortfolio().subscribe(res => {
            this.portfolio = res.portfolio;
            SpinnerUtil.hideSpinner();

            setTimeout(() => {
                (<any>$('select')).selectpicker();
            }, 200);

        }, hideSpinnerAndDisplayError);
    }

    onChangeSelect(item: any) {
        this.selectedProjectIndex = item;
        const folioItem = this.portfolio[item];
        this.personalShares = folioItem.investment;
        this.totalShares = folioItem.project.expected_funding;
    }

    onChangeInput(shareValue: string) {
        const value = Number(shareValue);
        const folioItem = this.portfolio[this.selectedProjectIndex];

        this.remainingShares = folioItem.investment - value;
        this.sharesForSale = value;
        this.pricePaidFor = value;
        this.suggestedSalePrice = value * 0.7; // TODO: remove hardcoded multiplication value
    }
}

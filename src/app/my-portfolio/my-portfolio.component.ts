import { Component, OnInit } from '@angular/core';
import { Portfolio, PortfolioService, PortfolioStats } from '../shared/services/wallet/portfolio.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';


@Component({
    selector: 'app-my-portfolio',
    templateUrl: './my-portfolio.component.html',
    styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {
    hasWallet = false;
    portfolio: Portfolio[];
    stats: PortfolioStats;
    roi = 0;

    constructor(private portfolioService: PortfolioService,
                private walletService: WalletService) {
    }

    ngOnInit() {
        this.getTransactions();
    }

    getTransactions() {
        SpinnerUtil.showSpinner();

        this.walletService.getWallet().subscribe(walletRes => {
            if (walletRes.hash !== undefined) { // Check if wallet was activated by admin
                this.portfolioService.getPortfolioStats().subscribe((portfolioStatsRes) => {
                    this.hasWallet = true;
                    this.stats = portfolioStatsRes;
                    this.stats.investments = centsToBaseCurrencyUnit(this.stats.investments);
                    if (this.stats.investments > 0) {
                        this.roi = ((this.stats.earnings + this.stats.investments) / (this.stats.investments) - 1) * 100;
                    }
                    SpinnerUtil.showSpinner();
                    this.portfolioService.getPortfolio().subscribe((portfolioRes) => {
                        this.portfolio = portfolioRes.portfolio;
                        SpinnerUtil.hideSpinner();
                    }, hideSpinnerAndDisplayError);
                }, hideSpinnerAndDisplayError);

            } else {
                SpinnerUtil.hideSpinner();
            }
        }, err => {
            SpinnerUtil.hideSpinner();
        });
    }
}

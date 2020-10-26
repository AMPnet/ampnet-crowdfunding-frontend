import { Component, OnInit } from '@angular/core';
import { InvestmentsInProject, PortfolioService } from '../shared/services/wallet/portfolio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';

@Component({
    selector: 'app-investment-details',
    templateUrl: './investment-details.component.html',
    styleUrls: ['./investment-details.component.scss']
})
export class InvestmentDetailsComponent implements OnInit {

    public investment: InvestmentsInProject;
    public isCancelable: Boolean;

    constructor(private portfolioService: PortfolioService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        const id = this.activatedRoute.snapshot.params.id;

        SpinnerUtil.showSpinner();
        this.portfolioService.getInvestmentsInProject(id).subscribe(res => {
            this.investment = res;
            this.canCancelInvestment();
            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    private canCancelInvestment() {
        if (this.investment.transactions.length > 0) {
            const transaction = this.investment.transactions[0];
            this.portfolioService.isInvestmentCancelable(transaction.to_tx_hash, transaction.from_tx_hash)
                .subscribe((res) => {
                    this.isCancelable = res.can_cancel;
                });
        }
    }
}

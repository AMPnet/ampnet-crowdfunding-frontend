import { Component, OnInit } from '@angular/core';
import { InvestmentsInProject, PortfolioService } from '../shared/services/wallet/portfolio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendErrorRx, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-investment-details',
    templateUrl: './investment-details.component.html',
    styleUrls: ['./investment-details.component.scss']
})
export class InvestmentDetailsComponent {
    investment$: Observable<InvestmentsInProject>;
    isCancelable$: Observable<boolean>;

    constructor(private portfolioService: PortfolioService,
                private activatedRoute: ActivatedRoute) {
        const id = this.activatedRoute.snapshot.params.id;
        this.investment$ = this.portfolioService.getInvestmentsInProject(id)
            .pipe(shareReplay(1));

        this.isCancelable$ = this.investment$.pipe(
            switchMap(investment => {
                const transaction = investment.transactions[0];
                return this.portfolioService.isInvestmentCancelable(transaction.to_tx_hash, transaction.from_tx_hash).pipe(
                    displayBackendErrorRx(),
                    map(res => res.can_cancel)
                );
            })
        );
    }
}

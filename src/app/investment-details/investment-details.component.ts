import { Component, OnInit } from '@angular/core';
import { InvestmentsInProject, PortfolioService } from '../shared/services/wallet/portfolio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendErrorRx, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { switchMap } from 'rxjs/operators';
import { PopupService } from '../shared/services/popup.service';
import { ArkaneService } from '../shared/services/arkane.service';

@Component({
    selector: 'app-investment-details',
    templateUrl: './investment-details.component.html',
    styleUrls: ['./investment-details.component.css']
})
export class InvestmentDetailsComponent implements OnInit {

    public investment: InvestmentsInProject;
    public isCancelable: Boolean;

    constructor(private portfolioService: PortfolioService,
                private activatedRoute: ActivatedRoute,
                private walletService: WalletService,
                private popupService: PopupService,
                private arkaneService: ArkaneService,
                private router: Router) {
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

    cancelInvestment() {
        return this.portfolioService.generateCancelInvestmentTransaction(this.investment.project.uuid).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate(['/dash/wallet']))
        );
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

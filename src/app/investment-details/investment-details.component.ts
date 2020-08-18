import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../my-portfolio/portfolio.service';
import { ActivatedRoute } from '@angular/router';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { InvestmentsInProject } from '../my-portfolio/portfolio.models';
import { prettyDate } from '../utilities/date-format-util';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import swal from 'sweetalert2';

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
                private broadcastService: BroadcastService) {
    }

    ngOnInit() {
        const id = this.activatedRoute.snapshot.params.id;

        SpinnerUtil.showSpinner();
        this.portfolioService.getInvestmentsInProject(id).subscribe((res: any) => {
            this.investment = res;
            this.investment.transactions.map((v, i, a) => {
                const newV = v;
                newV.amount = centsToBaseCurrencyUnit(v.amount);
                newV.date = prettyDate(v.date);
                return newV;
            });
            this.canCancelInvestment();
            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    cancelInvestment() {
        SpinnerUtil.showSpinner();
        this.portfolioService.generateCancelInvestmentTransaction(this.investment.project.uuid)
            .subscribe(async (res: any) => {
                SpinnerUtil.hideSpinner();

                const arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
                const acc = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
                const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                    walletId: acc.wallets[0].id,
                    data: res.tx,
                    type: SignatureRequestType.AETERNITY_RAW
                });
                this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                    .subscribe(_ => {
                        this.showAlert();
                        SpinnerUtil.hideSpinner();
                    }, err => {
                        hideSpinnerAndDisplayError(err);
                    });
            }, err => {
                hideSpinnerAndDisplayError(err);
            });
    }

    private canCancelInvestment() {
        if (this.investment.transactions.length > 0) {
            const transaction = this.investment.transactions[0];
            this.portfolioService.isInvestmentCancelable(transaction.to_tx_hash, transaction.from_tx_hash)
                .subscribe((res: any) => {
                    this.isCancelable = res.can_cancel;
                });
        }
    }

    showAlert() {
        swal.fire({
            type: 'success',
            title: 'Transaction signed',
            text: 'Transaction is being processed...',
            footer: 'Your transaction status<a href="/dash/wallet">&nbsp;here</a>'
        });
        // This is a hack to fix bug in Sweet Alert lib -> always displays dropdown
        swal.getContent().getElementsByClassName('swal2-select').item(0).remove();
    }
}

import { Component, OnInit } from '@angular/core';
import { PaymentService, UserBankAccount } from '../shared/services/payment.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { Withdraw, WithdrawService } from '../shared/services/wallet/withdraw.service';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../shared/services/arkane.service';
import { PopupService } from '../shared/services/popup.service';
import { RouterService } from '../shared/services/router.service';
import { ErrorService } from '../shared/services/error.service';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
    activeBankAccount = 0;
    banks: UserBankAccount[];
    pendingWithdrawal: Withdraw;
    withdrawAmount = 0;

    constructor(private paymentService: PaymentService,
                private withdrawService: WithdrawService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private errorService: ErrorService,
                private router: RouterService) {
    }

    ngOnInit() {
        this.getBankAccounts();
        this.getMyPendingWithdraw();
    }

    getBankAccounts() {
        SpinnerUtil.showSpinner();
        this.paymentService.getMyBankAccounts().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.banks = res.bank_accounts;
        }, hideSpinnerAndDisplayError);
    }

    getMyPendingWithdraw() {
        SpinnerUtil.showSpinner();
        this.withdrawService.getMyPendingWithdraw().subscribe(res => {
            this.pendingWithdrawal = res;
        }, hideSpinnerAndDisplayError);
    }

    changeActiveAccount(index: number) {
        this.activeBankAccount = index;
    }

    requestWithdrawal() {
        const iban = this.banks[this.activeBankAccount].iban;
        return this.withdrawService.createWithdrawRequest(this.withdrawAmount, iban).pipe(
            this.errorService.handleError,
            tap(res => this.pendingWithdrawal = res)
        );
    }

    burnWithdraw() {
        SpinnerUtil.showSpinner();
        return this.withdrawService.generateApproveWithdrawTx(this.pendingWithdrawal.id).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate(['/dash/wallet'])),
            finalize(() => SpinnerUtil.hideSpinner()),
        );
    }

    deleteWithdrawal() {
        SpinnerUtil.showSpinner();

        return this.withdrawService.deleteWithdrawal(this.pendingWithdrawal.id).pipe(
            this.errorService.handleError,
            switchMap(() => this.popupService.success('Withdrawal deleted')),
            tap(() => this.pendingWithdrawal = undefined),
            finalize(() => SpinnerUtil.hideSpinner()),
        );
    }
}

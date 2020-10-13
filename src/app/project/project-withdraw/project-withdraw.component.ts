import { Component, OnInit } from '@angular/core';
import { PaymentService, UserBankAccount } from '../../shared/services/payment.service';
import { Withdraw, WithdrawService } from '../../shared/services/wallet/withdraw.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { PopupService } from '../../shared/services/popup.service';
import { ArkaneService } from '../../shared/services/arkane.service';

@Component({
    selector: 'app-project-withdraw',
    templateUrl: './project-withdraw.component.html',
    styleUrls: ['./project-withdraw.component.css']
})
export class ProjectWithdrawComponent implements OnInit {
    banks: UserBankAccount[];

    pendingWithdrawal: Withdraw;
    withdrawAmount = 0;
    bankAccountForm: FormGroup;

    projectID = '';

    constructor(private paymentService: PaymentService,
                private withdrawService: WithdrawService,
                private walletService: WalletService,
                private router: Router,
                private popupService: PopupService,
                private arkaneService: ArkaneService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {

        this.bankAccountForm = this.fb.group({
            iban: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.projectID = this.route.snapshot.params.projectID;
        this.getBankAccounts();
        this.getMyPendingWithdraw();
    }

    getBankAccounts() {
        SpinnerUtil.showSpinner();
        this.paymentService.getMyBankAccounts().pipe(displayBackendErrorRx(),
            tap(res => this.banks = res.bank_accounts),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    getMyPendingWithdraw() {
        SpinnerUtil.showSpinner();
        this.withdrawService.getProjectPendingWithdraw(this.projectID).pipe(displayBackendErrorRx(),
            tap(res => this.pendingWithdrawal = res),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    requestWithdrawal() {
        const controls = this.bankAccountForm.controls;
        const iban = controls['iban'].value.replace(/\s/g, '');

        return this.withdrawService.createProjectWithdrawRequest(this.withdrawAmount, iban, this.projectID).pipe(
            displayBackendErrorRx(),
            tap(res => this.pendingWithdrawal = res)
        );
    }

    burnWithdraw() {
        SpinnerUtil.showSpinner();
        return this.withdrawService.generateApproveWithdrawTx(this.pendingWithdrawal.id).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate(['/dash/wallet'])),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    deleteWithdrawal() {
        SpinnerUtil.showSpinner();
        return this.withdrawService.deleteWithdrawal(this.pendingWithdrawal.id).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.success('Withdrawal deleted')),
            tap(() => this.pendingWithdrawal = undefined),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}

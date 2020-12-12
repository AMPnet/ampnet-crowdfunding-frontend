import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../shared/services/wallet/deposit-service.service';
import { displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PlatformBankAccountService } from '../shared/services/wallet/platform-bank-account.service';
import { ErrorService } from '../shared/services/error.service';
import { finalize } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
    depositModel: Deposit;
    masterIban: string;

    projectUUID = '';

    constructor(private depositService: DepositServiceService,
                private bankAccountService: PlatformBankAccountService,
                private errorService: ErrorService) {
    }

    ngOnInit() {
        SpinnerUtil.showSpinner();
        this.getMasterIban();
        this.depositService.getMyPendingDeposit().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.depositModel = res;
        }, err => {
            SpinnerUtil.hideSpinner();
            if (err.status === 404) {
                this.generateDepositInfo();
            } else {
                displayBackendError(err);
            }
        });
    }

    generateDepositInfo() {
        SpinnerUtil.showSpinner();
        this.depositService.createDeposit().pipe(
            this.errorService.handleError,
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe(res => {
            this.depositModel = res;
        });
    }

    getMasterIban() {
        SpinnerUtil.showSpinner();
        this.bankAccountService.bankAccounts$.pipe(
            this.errorService.handleError,
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe(res => {
            this.masterIban = res.bank_accounts[0].iban;
        });
    }
}

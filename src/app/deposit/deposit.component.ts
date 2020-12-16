import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../shared/services/wallet/deposit-service.service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PlatformBankAccountService } from '../shared/services/wallet/platform-bank-account.service';
import { ErrorService } from '../shared/services/error.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
        this.depositService.getMyPendingDeposit().pipe(
            catchError(err => err.status === 404 ? this.generateDepositInfo() : throwError(err)),
            this.errorService.handleError,
            tap(res => this.depositModel = res),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    generateDepositInfo() {
        return this.depositService.createDeposit().pipe(
            this.errorService.handleError,
            tap(res => this.depositModel = res),
            finalize(() => SpinnerUtil.hideSpinner())
        );
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

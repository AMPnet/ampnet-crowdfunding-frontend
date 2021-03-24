import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../shared/services/wallet/deposit-service.service';
import { PlatformBankAccount, PlatformBankAccountService } from '../shared/services/wallet/platform-bank-account.service';
import { ErrorService } from '../shared/services/error.service';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppConfigService } from '../shared/services/app-config.service';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
    bankAccountState = BankAccountState;

    deposit$: Observable<Deposit>;
    bankAccount$: Observable<PlatformBankAccount | BankAccountState>;

    constructor(public appConfig: AppConfigService,
                private depositService: DepositServiceService,
                private bankAccountService: PlatformBankAccountService,
                private errorService: ErrorService) {
    }

    ngOnInit() {
        this.bankAccount$ = this.bankAccountService.bankAccounts$.pipe(
            this.errorService.handleError,
            map(res => res.bank_accounts[0]),
            map(bankAccount => bankAccount ?? BankAccountState.NOT_FOUND),
            shareReplay(1)
        );

        this.deposit$ = this.depositService.myPendingDeposit().pipe(
            this.errorService.handleError,
            catchError(err => err.status === 404 ? this.generateDepositInfo() : throwError(err)),
        );
    }

    private generateDepositInfo() {
        return this.depositService.createDeposit().pipe(
            this.errorService.handleError,
        );
    }
}

enum BankAccountState {
    NOT_FOUND = 'NOT_FOUND'
}

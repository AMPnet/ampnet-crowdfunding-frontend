import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../shared/services/wallet/deposit-service.service';
import { PlatformBankAccountService } from '../shared/services/wallet/platform-bank-account.service';
import { ErrorService } from '../shared/services/error.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
    deposit$: Observable<Deposit>;
    masterIBAN$: Observable<string>;

    constructor(private depositService: DepositServiceService,
                private bankAccountService: PlatformBankAccountService,
                private errorService: ErrorService) {
    }

    ngOnInit() {
        this.masterIBAN$ = this.bankAccountService.bankAccounts$.pipe(
            this.errorService.handleError,
            map(res => res.bank_accounts[0]?.iban)
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

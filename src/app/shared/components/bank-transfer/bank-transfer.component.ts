import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Deposit, DepositServiceService } from '../../services/wallet/deposit-service.service';
import { PlatformBankAccount, PlatformBankAccountService } from '../../services/wallet/platform-bank-account.service';
import { AppConfigService } from '../../services/app-config.service';
import { ErrorService } from '../../services/error.service';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { enterTrigger } from '../../animations';

@Component({
    selector: 'app-bank-transfer',
    templateUrl: './bank-transfer.component.html',
    styleUrls: ['./bank-transfer.component.scss'],
    animations: [enterTrigger]
})
export class BankTransferComponent implements OnInit {
    // projectUUID is used only for bank transfers to project. If empty,
    // the bank transfer is going to be addressed to user.
    @Input() projectUUID = '';

    deposit$: Observable<Deposit | DepositState>;
    bankAccount$: Observable<PlatformBankAccount | BankAccountState>;

    refreshDepositSubject = new BehaviorSubject<void>(null);

    bankAccountState = BankAccountState;
    depositState = DepositState;

    createDepositForm: FormGroup;
    confirmDepositForm: FormGroup;

    constructor(public appConfig: AppConfigService,
                private depositService: DepositServiceService,
                private bankAccountService: PlatformBankAccountService,
                private errorService: ErrorService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.bankAccount$ = this.bankAccountService.bankAccounts$.pipe(
            this.errorService.handleError,
            map(res => res.bank_accounts[0]),
            map(bankAccount => bankAccount ?? BankAccountState.NOT_FOUND),
            shareReplay(1)
        );

        this.deposit$ = this.refreshDepositSubject.pipe(
            switchMap(() => this.depositService.pendingDeposit(this.projectUUID).pipe(
                this.errorService.handleError,
                catchError(err => err.status === 404 ? of(DepositState.NOT_FOUND) : throwError(err))
            )),
        ) as Observable<DepositState | Deposit>;

        this.createDepositForm = this.fb.group({
            amount: [0, (c: FormControl) => c.value > 0 ? null : {invalid: true}]
        });

        this.confirmDepositForm = this.fb.group({
            confirmed: [false, Validators.requiredTrue]
        });
    }

    createDeposit(amount: number) {
        return () => {
            return this.depositService.createDeposit(amount, this.projectUUID).pipe(
                this.errorService.handleError,
                tap(() => {
                    this.refreshDepositSubject.next();
                    this.createDepositForm.reset();
                })
            );
        };
    }

    deleteDeposit(depositID: number) {
        return () => {
            return this.depositService.deleteDeposit(depositID).pipe(
                this.errorService.handleError,
                tap(() => {
                    this.refreshDepositSubject.next();
                    this.confirmDepositForm.reset();
                })
            );
        };
    }

    confirmDeposit(depositID: number) {
        return () => {
            return this.depositService.confirmDeposit(depositID).pipe(
                this.errorService.handleError,
                tap(() => this.refreshDepositSubject.next())
            );
        };
    }
}

enum BankAccountState {
    NOT_FOUND = 'NOT_FOUND'
}

enum DepositState {
    NOT_FOUND = 'NOT_FOUND'
}

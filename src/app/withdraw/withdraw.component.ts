import { Component, OnInit } from '@angular/core';
import { PaymentService, UserBankAccount } from '../shared/services/payment.service';
import { Withdraw, WithdrawService } from '../shared/services/wallet/withdraw.service';
import { WalletDetailsWithState, WalletService } from '../shared/services/wallet/wallet.service';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { ArkaneService } from '../shared/services/arkane.service';
import { PopupService } from '../shared/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AnalyticsService, GAEvents } from '../shared/services/analytics.service';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
    response = Response;

    wallet$: Observable<WalletDetailsWithState>;
    banks$: Observable<UserBankAccount[]>;
    withdrawal$: Observable<Withdraw | Response>;
    refreshWithdrawalSubject = new BehaviorSubject<Withdraw>(null);

    withdrawForm: FormGroup;

    constructor(private paymentService: PaymentService,
                private withdrawService: WithdrawService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private analytics: AnalyticsService,
                private translate: TranslateService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.wallet$ = this.walletService.wallet$;

        this.banks$ = this.paymentService.getMyBankAccounts().pipe(
            map(res => res.bank_accounts)
        );

        this.withdrawal$ = this.refreshWithdrawalSubject.asObservable().pipe(
            switchMap(w => w !== null ? of(w) :
                this.withdrawService.getMyPendingWithdraw().pipe(
                    catchError(err => err.status === 404 ? of(Response.EMPTY) : throwError(err)),
                )
            ),
        );

        this.withdrawForm = this.fb.group({
            amount: [0, [], [this.validAmount.bind(this)]],
            bank: [null, Validators.required]
        });
    }

    private validAmount(control: AbstractControl): Observable<ValidationErrors | null> {
        return combineLatest([this.wallet$]).pipe(take(1),
            map(([wallet]) => {
                const amount = control.value;

                if (amount === 0) {
                    return {amountZero: true};
                } else if (wallet.wallet.balance === 0) {
                    return {balanceZero: true};
                } else if (amount > wallet.wallet.balance) {
                    return {amountAboveBalance: true};
                } else {
                    return null;
                }
            })
        );
    }

    setBank(bank: UserBankAccount) {
        this.withdrawForm.get('bank').setValue(bank);
    }

    requestWithdrawal() {
        const amount: number = this.withdrawForm.value.amount;
        const bank: UserBankAccount = this.withdrawForm.value.bank;
        return this.withdrawService.createWithdrawRequest(amount, bank.iban, bank.bank_code).pipe(
            tap(w => {
                this.withdrawForm.reset();
                this.refreshWithdrawalSubject.next(w);
            })
        );
    }

    signWithdrawal(withdrawalID: number) {
        return () => {
            return this.withdrawService.generateApproveWithdrawTx(withdrawalID).pipe(
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.popupService.new({
                    type: 'success',
                    title: this.translate.instant('general.transaction_signed.title'),
                    text: this.translate.instant('general.transaction_signed.description')
                })),
                tap(() => {
                    this.analytics.eventTrack(GAEvents.WITHDRAW_TX_SIGNED);
                    this.refreshWithdrawalSubject.next(null);
                }),
            );
        };
    }

    deleteWithdrawal(withdrawalID: number) {
        return () => {
            return this.withdrawService.deleteWithdrawal(withdrawalID).pipe(
                switchMap(() => this.popupService.success(
                    this.translate.instant('withdraw.withdrawal_deleted'))),
                tap(() => {
                    this.analytics.eventTrack(GAEvents.WITHDRAW_TX_CANCELED);
                    this.refreshWithdrawalSubject.next(null);
                }),
            );
        };
    }
}

enum Response {
    EMPTY = 'EMPTY'
}

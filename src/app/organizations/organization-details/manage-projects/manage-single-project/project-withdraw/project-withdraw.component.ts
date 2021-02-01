import { Component } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../../../shared/services/arkane.service';
import { ActivatedRoute } from '@angular/router';
import { Withdraw, WithdrawService } from '../../../../../shared/services/wallet/withdraw.service';
import { PopupService } from '../../../../../shared/services/popup.service';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { RouterService } from '../../../../../shared/services/router.service';
import { ErrorService } from '../../../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { Wallet, WalletService } from '../../../../../shared/services/wallet/wallet.service';

@Component({
    selector: 'app-project-withdraw',
    templateUrl: './project-withdraw.component.html',
    styleUrls: ['./project-withdraw.component.scss']
})
export class ProjectWithdrawComponent {
    withdrawalState = WithdrawalState;

    projectID: string;

    projectWallet$: Observable<Wallet>;
    refreshWithdrawalSubject = new BehaviorSubject<Withdraw>(null);
    withdrawal$: Observable<Withdraw | WithdrawalState>;

    withdrawalForm: FormGroup;

    constructor(private withdrawService: WithdrawService,
                private walletService: WalletService,
                private router: RouterService,
                private popupService: PopupService,
                private arkaneService: ArkaneService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
        this.projectID = this.route.snapshot.params.projectID;

        this.projectWallet$ = this.walletService.getProjectWallet(this.projectID).pipe(
            this.errorService.handleError,
            shareReplay(1)
        );

        this.withdrawal$ = this.refreshWithdrawalSubject.pipe(
            switchMap(data => data !== null ? of(data) :
                this.withdrawService.getProjectPendingWithdraw(this.projectID).pipe(
                    this.errorService.handleError,
                    catchError(err => err.status === 404 ?
                        of(WithdrawalState.EMPTY) : this.recoverBack())
                )
            )
        );

        this.withdrawalForm = this.fb.group({
            amount: [0, [], [this.validAmount.bind(this)]],
            iban: ['', [Validators.required]],
        });
    }

    private validAmount(control: AbstractControl): Observable<ValidationErrors | null> {
        return combineLatest([this.projectWallet$]).pipe(take(1),
            map(([wallet]) => {
                const amount = control.value;

                if (amount === 0) {
                    return {amountZero: true};
                } else if (wallet.balance === 0) {
                    return {balanceZero: true};
                } else if (amount > wallet.balance) {
                    return {amountAboveBalance: true};
                } else {
                    return null;
                }
            })
        );
    }

    requestWithdrawal() {
        const amount: number = this.withdrawalForm.get('amount').value;
        const iban: string = this.withdrawalForm.get('iban').value.replace(/\s/g, '');

        return this.withdrawService.createProjectWithdrawRequest(amount, iban, this.projectID).pipe(
            this.errorService.handleError,
            tap(withdraw => {
                this.refreshWithdrawalSubject.next(withdraw);
                this.withdrawalForm.reset();
            })
        );
    }

    signWithdrawal(withdrawalID: number) {
        return () => {
            return this.withdrawService.generateApproveWithdrawTx(withdrawalID).pipe(
                this.errorService.handleError,
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.popupService.new({
                    type: 'success',
                    title: this.translate.instant('general.transaction_signed.title'),
                    text: this.translate.instant('general.transaction_signed.description')
                })),
                tap(() => this.refreshWithdrawalSubject.next(null)),
            );
        };
    }

    deleteWithdrawal(withdrawalID: number) {
        return () => {
            return this.withdrawService.deleteWithdrawal(withdrawalID).pipe(
                this.errorService.handleError,
                switchMap(() => this.popupService.success(
                    this.translate.instant('projects.edit.manage_payments.withdraw.deleted')
                )),
                tap(() => this.refreshWithdrawalSubject.next(null)),
            );
        };
    }

    private recoverBack(): Observable<never> {
        this.router.navigate(['../'], {relativeTo: this.route});
        return EMPTY;
    }
}

enum WithdrawalState {
    EMPTY = 'EMPTY'
}

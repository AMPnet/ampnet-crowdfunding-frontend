import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { Wallet, WalletService } from '../../shared/services/wallet/wallet.service';
import { Withdraw, WithdrawService } from '../../shared/services/wallet/withdraw.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RouterService } from '../../shared/services/router.service';
import { PopupService } from '../../shared/services/popup.service';
import { ArkaneService } from '../../shared/services/arkane.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { AnalyticsService, GAEvents } from '../../shared/services/analytics.service';

@Component({
    selector: 'app-project-withdraw',
    templateUrl: './project-withdraw.component.html',
    styleUrls: ['./project-withdraw.component.scss']
})
export class ProjectWithdrawComponent {
    withdrawalState = WithdrawalState;

    projectUUID: string;

    projectWallet$: Observable<Wallet>;
    refreshWithdrawalSubject = new BehaviorSubject<Withdraw>(null);
    withdrawal$: Observable<Withdraw | WithdrawalState>;

    withdrawalForm: FormGroup;

    constructor(private withdrawService: WithdrawService,
                private walletService: WalletService,
                private router: RouterService,
                private popupService: PopupService,
                private arkaneService: ArkaneService,
                private translate: TranslateService,
                private analytics: AnalyticsService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
        this.projectUUID = this.route.snapshot.params.id;

        this.projectWallet$ = this.walletService.getProjectWallet(this.projectUUID).pipe(
            shareReplay(1)
        );

        this.withdrawal$ = this.refreshWithdrawalSubject.pipe(
            switchMap(data => data !== null ? of(data) :
                this.withdrawService.getProjectPendingWithdraw(this.projectUUID).pipe(
                    catchError(err => err.status === 404 ?
                        of(WithdrawalState.EMPTY) : this.recoverBack())
                )
            )
        );

        this.withdrawalForm = this.fb.group({
            amount: [0, [], [this.validAmount.bind(this)]],
            iban: ['', [Validators.required]],
            swift: ['', [Validators.required]],
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
        const swift: string = String(this.withdrawalForm.get('swift').value).trim();

        return this.withdrawService.createProjectWithdrawRequest(amount, iban, swift, this.projectUUID).pipe(
            tap(withdraw => {
                this.refreshWithdrawalSubject.next(withdraw);
                this.withdrawalForm.reset();
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
                    this.analytics.eventTrack(GAEvents.WITHDRAW_TX_SIGNED, {withdrawalID});
                    this.refreshWithdrawalSubject.next(null);
                }),
            );
        };
    }

    deleteWithdrawal(withdrawalID: number) {
        return () => {
            return this.withdrawService.deleteWithdrawal(withdrawalID).pipe(
                switchMap(() => this.popupService.success(
                    this.translate.instant('projects.withdraw.deleted')
                )),
                tap(() => {
                    this.analytics.eventTrack(GAEvents.WITHDRAW_TX_CANCELED, {withdrawalID});
                    this.refreshWithdrawalSubject.next(null);
                }),
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

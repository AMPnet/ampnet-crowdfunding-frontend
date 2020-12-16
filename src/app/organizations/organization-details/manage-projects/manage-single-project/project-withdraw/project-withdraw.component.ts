import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../../../shared/services/arkane.service';
import { ActivatedRoute } from '@angular/router';
import { Withdraw, WithdrawService } from '../../../../../shared/services/wallet/withdraw.service';
import { displayBackendErrorRx } from '../../../../../utilities/error-handler';
import { SpinnerUtil } from '../../../../../utilities/spinner-utilities';
import { PopupService } from '../../../../../shared/services/popup.service';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { RouterService } from '../../../../../shared/services/router.service';

@Component({
    selector: 'app-project-withdraw',
    templateUrl: './project-withdraw.component.html',
    styleUrls: ['./project-withdraw.component.scss']
})
export class ProjectWithdrawComponent {
    withdrawalState = WithdrawalState;
    projectID: string;
    orgID: string;

    refreshWithdrawalSubject = new BehaviorSubject<Withdraw | WithdrawalState>(null);
    withdrawal$: Observable<Withdraw | WithdrawalState>;

    requestWithdrawForm: FormGroup;

    constructor(private withdrawService: WithdrawService,
                private router: RouterService,
                private popupService: PopupService,
                private arkaneService: ArkaneService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
        this.projectID = this.route.snapshot.params.projectID;
        this.orgID = this.route.snapshot.params.groupID;

        this.withdrawal$ = this.refreshWithdrawalSubject.pipe(
            switchMap(data => data !== null ?
                of(data) :
                this.withdrawService.getProjectPendingWithdraw(this.projectID).pipe(
                    displayBackendErrorRx(),
                    catchError(err => err.status === 404 ?
                        of(WithdrawalState.EMPTY) : this.recoverBack())
                )
            )
        );

        this.requestWithdrawForm = this.fb.group({
            amount: [0, [
                Validators.required,
                (c: FormControl) => c.value > 0 ? null : {invalid: true}]
            ],
            iban: ['', [Validators.required]],
        });
    }

    requestWithdrawal() {
        const amount: number = this.requestWithdrawForm.get('amount').value;
        const iban: string = this.requestWithdrawForm.get('iban').value.replace(/\s/g, '');

        return this.withdrawService.createProjectWithdrawRequest(amount, iban, this.projectID).pipe(
            displayBackendErrorRx(),
            tap(withdraw => this.refreshWithdrawalSubject.next(withdraw))
        );
    }

    burnWithdraw(withdrawal: Withdraw) {
        return () => {
            SpinnerUtil.showSpinner();
            return this.withdrawService.generateApproveWithdrawTx(withdrawal.id).pipe(
                displayBackendErrorRx(),
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.popupService.new({
                    type: 'success',
                    title: 'Transaction signed',
                    text: 'Transaction is being processed...'
                })),
                switchMap(() => this.recoverBack()),
                finalize(() => SpinnerUtil.hideSpinner())
            );
        };
    }

    deleteWithdrawal(withdrawal: Withdraw) {
        SpinnerUtil.showSpinner();
        return this.withdrawService.deleteWithdrawal(withdrawal.id).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.success('Withdrawal deleted')),
            tap(() => this.refreshWithdrawalSubject.next(WithdrawalState.EMPTY)),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    private recoverBack(): Observable<never> {
        this.router.navigate(['../'], {relativeTo: this.route});
        return EMPTY;
    }
}

enum WithdrawalState {
    EMPTY = 'EMPTY'
}

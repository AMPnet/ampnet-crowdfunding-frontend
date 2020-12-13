import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    DepositSearchResponse,
    WalletCooperativeDepositService
} from '../../../shared/services/wallet/wallet-cooperative/wallet-cooperative-deposit.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManageSingleDepositModalComponent } from './manage-single-deposit-modal/manage-single-deposit-modal.component';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { PopupService } from '../../../shared/services/popup.service';
import { EMPTY, Observable, of } from 'rxjs';
import { CurrencyDefaultPipe } from '../../../shared/pipes/currency-default.pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileValidator } from '../../../shared/validators/file.validator';
import { RouterService } from '../../../shared/services/router.service';
import { ErrorService } from '../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-manage-single-deposit',
    templateUrl: './manage-single-deposit.component.html',
    styleUrls: ['./manage-single-deposit.component.css'],
})
export class ManageSingleDepositComponent implements OnInit {
    deposit$: Observable<DepositSearchResponse>;

    confirmDepositForm: FormGroup;
    confirmationModal: BsModalRef;

    constructor(private route: ActivatedRoute,
                private depositCooperativeService: WalletCooperativeDepositService,
                private modalService: BsModalService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private fb: FormBuilder,
                private errorService: ErrorService,
                private translate: TranslateService,
                private currencyPipe: CurrencyDefaultPipe,
                private router: RouterService) {
        const id = this.route.snapshot.params.ID;
        this.deposit$ = this.getDepositProcedure(id);
    }

    ngOnInit() {
        this.confirmDepositForm = this.fb.group({
            amount: [0, (c: FormControl) => c.value > 0 ? null : {invalid: true}],
            document: [null, FileValidator.validate]
        });
    }

    getDepositProcedure(reference: string): Observable<DepositSearchResponse> {
        return this.depositCooperativeService.getDeposit(reference).pipe(
            catchError(err => {
                if (err.status === 404) {
                    return this.popupService.new({
                        type: 'error',
                        title: 'Not found',
                        text: 'Deposit transaction with this reference code was not found.'
                    }).pipe(switchMap(() => this.recoverBack()));
                }
                return this.recoverBack();
            }),
            this.errorService.handleError,
            switchMap(res => {
                if (!res.deposit.approved_at) {
                    return of(res);
                } else if (!!res.deposit.approved_at && !res.deposit.tx_hash) {
                    const amount = this.currencyPipe.transform(res.deposit.amount);
                    return this.popupService.new({
                        type: 'info',
                        title: 'Transaction already approved',
                        text: `You will be prompted to sign deposit transaction of ${amount}`
                    }).pipe(
                        switchMap(popup => !popup.dismiss ?
                            this.generateSignerAndSign(res.deposit.id) : this.recoverBack()),
                        switchMap(() => EMPTY)
                    );
                } else {
                    this.router.navigate(['/dash/manage_deposits']);
                    return EMPTY;
                }
            }),
            finalize(() => SpinnerUtil.hideSpinner()));
    }

    generateSignerAndSign(depositID: number) {
        return this.depositCooperativeService.generateDepositMintTx(depositID).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            catchError(() => this.recoverBack()),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            switchMap(() => this.router.navigate(['/dash/manage_deposits']))
        );
    }

    showConfirmModal(form: FormGroup, depositID: number) {
        const amount = form.get('amount').value;
        const document = form.get('document').value;

        this.confirmationModal = this.modalService.show(ManageSingleDepositModalComponent, {
            initialState: {
                depositAmount: amount
            }
        });

        const confirmationSub = this.confirmationModal.content.successfulConfirmation.subscribe(() => {
            SpinnerUtil.showSpinner();
            this.depositCooperativeService.approveDeposit(depositID, amount, document).pipe(
                this.errorService.handleError,
                catchError(() => this.recoverBack()),
                switchMap(() => this.generateSignerAndSign(depositID)),
                finalize(() => SpinnerUtil.hideSpinner())
            ).subscribe();
        });

        this.confirmationModal.onHide.subscribe(() => confirmationSub.unsubscribe());
    }

    private recoverBack(): Observable<never> {
        this.router.navigate(['/dash/manage_deposits'], {relativeTo: this.route});
        return EMPTY;
    }
}

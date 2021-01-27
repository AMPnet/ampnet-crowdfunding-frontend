import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    CoopWithdraw,
    WalletCooperativeWithdrawService
} from 'src/app/shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { PopupService } from '../../../shared/services/popup.service';
import { switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RouterService } from '../../../shared/services/router.service';
import { ErrorService } from '../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileValidator } from '../../../shared/validators/file.validator';
import { Withdraw } from '../../../shared/services/wallet/withdraw.service';

@Component({
    selector: 'app-single-withdrawal',
    templateUrl: './single-withdrawal.component.html',
    styleUrls: ['./single-withdrawal.component.css']
})
export class SingleWithdrawalComponent implements OnInit {
    withdrawalID: number;

    refreshWithdrawalSubject = new BehaviorSubject<void>(null);
    withdrawal$: Observable<CoopWithdraw>;

    documentForm: FormGroup;

    constructor(private route: ActivatedRoute,
                private withdrawCoopService: WalletCooperativeWithdrawService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private fb: FormBuilder,
                private router: RouterService) {
    }

    ngOnInit() {
        this.withdrawalID = Number(this.route.snapshot.params.ID);
        this.withdrawal$ = this.refreshWithdrawalSubject.asObservable().pipe(
            switchMap(() => this.withdrawCoopService.getWithdrawal(this.withdrawalID))
        );

        this.documentForm = this.fb.group({
            document: [null, FileValidator.validate]
        });
    }

    signTransaction() {
        return this.withdrawCoopService.generateBurnWithdrawTx(this.withdrawalID).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            tap(() => this.refreshWithdrawalSubject.next())
        );
    }

    submitDocument(): Observable<Withdraw> {
        return this.withdrawCoopService.approveWithdrawal(
            this.withdrawalID, this.documentForm.get('document').value
        ).pipe(
            this.errorService.handleError,
            tap(() => this.router.navigate(['/dash/manage_withdrawals']))
        );
    }
}

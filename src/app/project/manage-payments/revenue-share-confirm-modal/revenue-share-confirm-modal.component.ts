import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { autonumericCurrency, stripCurrencyData } from '../../../utilities/currency-util';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SpinnerUtil } from '../../../utilities/spinner-utilities';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import swal from 'sweetalert2';
import { hideSpinnerAndDisplayError } from '../../../utilities/error-handler';
import { RevenueShareService } from '../../../shared/services/wallet/revenue-share.service';
import { BroadcastService } from '../../../shared/services/broadcast.service';

@Component({
    selector: 'app-revenue-share-confirm-modal',
    templateUrl: './revenue-share-confirm-modal.component.html',
    styleUrls: ['./revenue-share-confirm-modal.component.css']
})

export class RevenueShareConfirmModalComponent implements OnInit {
    projectID: string;
    amountInvestedConfirm: string;

    confirmForm: FormGroup;

    constructor(private bsModalRef: BsModalRef,
                private formBuilder: FormBuilder,
                private revenueShareService: RevenueShareService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit(): void {
        autonumericCurrency('#revenue-confirm-amount');
        this.confirmForm = this.formBuilder.group({
            amount: ['', [Validators.required, Validators.pattern(this.amountInvestedConfirm)]]
        });
    }

    generateTransaction(amountInvested: number) {
        SpinnerUtil.showSpinner();
        this.revenueShareService.generateRevenueShareTx(this.projectID, amountInvested)
            .subscribe(async (res) => {
                const arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
                const acc = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
                const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                    walletId: acc.wallets[0].id,
                    data: res.tx,
                    type: SignatureRequestType.AETERNITY_RAW
                });
                this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                    .subscribe(_ => {
                        swal('', 'Successful revenue payout!', 'success');
                        SpinnerUtil.hideSpinner();
                    }, err => {
                        hideSpinnerAndDisplayError(err);
                    });
            }, err => {
                hideSpinnerAndDisplayError(err);
            });
    }

    onConfirm(): void {
        this.bsModalRef.hide();
        this.generateTransaction(Number(stripCurrencyData(this.amountInvestedConfirm, '€')));
    }

    onCancel(): void {
        this.bsModalRef.hide();
    }
}

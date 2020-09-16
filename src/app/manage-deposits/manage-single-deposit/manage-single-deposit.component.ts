import { Component, Input, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { ActivatedRoute } from '@angular/router';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import * as numeral from 'numeral';
import {
    DepositSearchResponse,
    WalletCooperativeDepositService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-deposit.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';
import { autonumericCurrency, baseCurrencyUnitToCents } from 'src/app/utilities/currency-util';
import MicroModal from 'micromodal';
import { BackendHttpClient } from '../../shared/services/backend-http-client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManageSingleDepositModalComponent } from './manage-single-deposit-modal/manage-single-deposit-modal.component';
import { KeyboardType } from 'tns-core-modules/ui/enums';

declare var $: any;

@Component({
    selector: 'app-manage-single-deposit',
    templateUrl: './manage-single-deposit.component.html',
    styleUrls: ['./manage-single-deposit.component.css']
})
export class ManageSingleDepositComponent implements OnInit {
    @Input() depositAmount;
    confirmationModal: BsModalRef;
    depositModel: DepositSearchResponse;
    paymentUppy: Uppy.Core.Uppy;

    constructor(private route: ActivatedRoute,
                private http: BackendHttpClient,
                private depositCooperativeService: WalletCooperativeDepositService,
                private broadService: BroadcastService,
                private modalService: BsModalService) {
    }

    ngOnInit() {
        this.getDeposit();
    }


    createUploadArea() {
        this.paymentUppy = Uppy.Core();

        this.paymentUppy.use(Uppy.Dashboard, {
            id: 'reciept-payment',
            target: document.getElementById('payment-reciept-upload-target'),
            inline: true,
            height: 300,
            width: $('.root-content-container').width(),
            note: 'Upload payment reciept for deposit',
            hideUploadButton: true,
        });
    }

    generateSignerAndSign() {
        SpinnerUtil.showSpinner();

        this.depositCooperativeService.generateDepositMintTx(this.depositModel.deposit.id).subscribe(async res => {
            SpinnerUtil.hideSpinner();
            const arkaneConnect = new ArkaneConnect('AMPnet', {
                environment: 'staging'
            });

            const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);

            const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                walletId: account.wallets[0].id,
                data: res.tx,
                type: SignatureRequestType.AETERNITY_RAW
            });
            this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                .subscribe(_ => {
                    SpinnerUtil.hideSpinner();
                    swal('', 'Success', 'success');
                }, hideSpinnerAndDisplayError);
        }, hideSpinnerAndDisplayError);
    }

    getDeposit() {
        const id = this.route.snapshot.params.ID;
        SpinnerUtil.showSpinner();
        this.depositCooperativeService.getDeposit(id).subscribe(res => {
            this.depositModel = res;

            this.depositModel.deposit.amount = numeral(this.depositModel.deposit.amount).format(',');
            if (!this.depositModel.deposit.approved) {
                setTimeout(() => {
                    this.createUploadArea();
                    MicroModal.init();
                }, 300);
            } else {
                this.generateSignerAndSign();
            }

            setTimeout(() => {
                autonumericCurrency('#deposit-amount');
            }, 200);

            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    showConfirmModal() {
        this.confirmationModal = this.modalService.show(ManageSingleDepositModalComponent, {
            initialState: {
                depositAmount: this.depositAmount
            }
        });
        const confirmationSub = this.confirmationModal.content.onSuccessfulConfirmation
            .subscribe(() => {
                console.log('subscribe');
                const depositApprovalURL = this.depositCooperativeService.generateDepositApprovalURL(
                    location.origin,
                    this.depositModel.deposit.id,
                    Number(baseCurrencyUnitToCents(this.depositAmount))
                );

                this.paymentUppy.use(Uppy.XHRUpload, {
                    endpoint: depositApprovalURL,
                    fieldName: 'file',
                    headers: {
                        'Authorization': this.http.authHttpOptions().headers.get('Authorization')
                    }
                });
                confirmationSub.unsubscribe();
                // SpinnerUtil.showSpinner();
                // this.paymentUppy.upload().then(() => {
                //     SpinnerUtil.hideSpinner();
                //     this.getDeposit();
                // });
            });
    }
}

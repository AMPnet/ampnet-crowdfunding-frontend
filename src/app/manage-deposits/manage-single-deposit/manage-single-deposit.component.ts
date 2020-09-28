import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { ActivatedRoute, Router } from '@angular/router';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    DepositSearchResponse,
    WalletCooperativeDepositService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-deposit.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';
import { BackendHttpClient } from '../../shared/services/backend-http-client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManageSingleDepositModalComponent } from './manage-single-deposit-modal/manage-single-deposit-modal.component';

declare var $: any;

@Component({
    selector: 'app-manage-single-deposit',
    templateUrl: './manage-single-deposit.component.html',
    styleUrls: ['./manage-single-deposit.component.css'],
})
export class ManageSingleDepositComponent implements OnInit {
    amount = 0;
    confirmationModal: BsModalRef;
    depositModel: DepositSearchResponse;
    paymentUppy: Uppy.Core.Uppy;
    fileAttached = false;

    constructor(private route: ActivatedRoute,
                private http: BackendHttpClient,
                private depositCooperativeService: WalletCooperativeDepositService,
                private broadService: BroadcastService,
                private modalService: BsModalService,
                private router: Router) {
    }

    ngOnInit() {
        this.getDeposit();

        this.paymentUppy = Uppy.Core({
            restrictions: {
                allowedFileTypes: ['.png', '.jpeg', '.jpg', '.pdf'],
                maxNumberOfFiles: 1
            }
        });

        this.paymentUppy.use(Uppy.Dashboard, {
            id: 'receipt-payment',
            target: document.getElementById('payment-receipt-upload-target'),
            inline: true,
            height: 300,
            width: $('.root-content-container').width(),
            note: 'Upload payment receipt for deposit',
            hideUploadButton: true,
            plugins: ['XHRUpload']
        });

        this.paymentUppy.on('file-added', () => this.isFileAttached());
        this.paymentUppy.on('file-removed', () => this.isFileAttached());
        this.paymentUppy.on('upload-error', (file) => {
            SpinnerUtil.hideSpinner();
            this.paymentUppy.removeFile(file.id);
            this.removeUppyPlugin();
        });
    }

    isFileAttached() {
        this.fileAttached = this.paymentUppy.getFiles().length > 0;
    }

    generateSignerAndSign() {
        SpinnerUtil.showSpinner();
        this.depositCooperativeService.generateDepositMintTx(this.depositModel.deposit.id)
            .subscribe(async res => {
                const arkaneConnect = new ArkaneConnect('AMPnet', {
                    environment: 'staging'
                });

                try {
                    const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
                    const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                        walletId: account.wallets[0].id,
                        data: res.tx,
                        type: SignatureRequestType.AETERNITY_RAW
                    });
                    this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                        .subscribe(_ => {
                            swal('', 'Success', 'success')
                                .then(() => {
                                    SpinnerUtil.hideSpinner();
                                    this.router.navigate(['/dash/manage_deposits']);
                                });
                        }, hideSpinnerAndDisplayError);
                } catch (error) {
                    // When user close Arkane popup window
                    if (error.status !== undefined && error.status.length > 0) {
                        swal('', error.status, 'warning');
                    }
                    SpinnerUtil.hideSpinner();
                    this.removeUppyPlugin();
                }
            }, hideSpinnerAndDisplayError);
    }

    getDeposit() {
        SpinnerUtil.showSpinner();
        const id = this.route.snapshot.params.ID;
        this.depositCooperativeService.getDeposit(id).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.depositModel = res;
            if (this.depositModel.deposit.approved) {
                this.generateSignerAndSign();
            }
        }, hideSpinnerAndDisplayError);
    }

    showConfirmModal() {
        this.confirmationModal = this.modalService.show(ManageSingleDepositModalComponent, {
            initialState: {
                depositAmount: this.amount
            }
        });
        const confirmationSub = this.confirmationModal.content.successfulConfirmation
            .subscribe(() => {
                const depositApprovalURL = this.depositCooperativeService.generateDepositApprovalURL(
                    location.origin,
                    this.depositModel.deposit.id,
                    this.amount
                );
                this.paymentUppy.use(Uppy.XHRUpload, {
                    endpoint: depositApprovalURL,
                    fieldName: 'file',
                    headers: {
                        'Authorization': this.http.authHttpOptions().headers.get('Authorization')
                    }
                });
                confirmationSub.unsubscribe();
                SpinnerUtil.showSpinner();
                this.paymentUppy.upload().then(() => {
                    SpinnerUtil.hideSpinner();
                    this.getDeposit();
                });
            }, hideSpinnerAndDisplayError);
    }

    removeUppyPlugin() {
        const instance = this.paymentUppy.getPlugin('XHRUpload');
        if (instance !== null) {
            this.paymentUppy.removePlugin(instance);
        }
    }
}

import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    DepositSearchResponse,
    WalletCooperativeDepositService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-deposit.service';
import { BackendHttpClient } from '../../shared/services/backend-http-client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManageSingleDepositModalComponent } from './manage-single-deposit-modal/manage-single-deposit-modal.component';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { BroadcastService } from '../../shared/services/broadcast.service';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { throwError } from 'rxjs';

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
                private arkaneService: ArkaneService,
                private popupService: PopupService,
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

        this.paymentUppy.on('file-added', () => this.onFilesChange());
        this.paymentUppy.on('file-removed', () => this.onFilesChange());
        this.paymentUppy.on('upload-error', file => {
            SpinnerUtil.hideSpinner();
            this.paymentUppy.removeFile(file.id);
            this.removeUppyPlugin();
        });
    }

    onFilesChange() {
        this.fileAttached = this.paymentUppy.getFiles().length > 0;
    }

    generateSignerAndSign() {
        this.depositCooperativeService.generateDepositMintTx(this.depositModel.deposit.id).pipe(
            catchError(err => {
                displayBackendError(err);
                return throwError(err);
            }),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate(['/dash/manage_deposits']))
        ).subscribe();
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
        const confirmationSub = this.confirmationModal.content.successfulConfirmation.pipe(
            finalize(() => confirmationSub.unsubscribe()))
            .subscribe(() => {
                const depositApprovalURL = this.depositCooperativeService.generateDepositApprovalURL(
                    location.origin,
                    this.depositModel.deposit.id,
                    this.amount
                );
                this.removeUppyPlugin();
                this.paymentUppy.use(Uppy.XHRUpload, {
                    endpoint: depositApprovalURL,
                    fieldName: 'file',
                    headers: {
                        'Authorization': this.http.authHttpOptions().headers.get('Authorization')
                    }
                });
                SpinnerUtil.showSpinner();
                this.paymentUppy.upload().then(() => {
                    SpinnerUtil.hideSpinner();
                    this.getDeposit();
                }).catch(hideSpinnerAndDisplayError);
            }, hideSpinnerAndDisplayError);
    }

    removeUppyPlugin() {
        const instance = this.paymentUppy.getPlugin('XHRUpload');
        if (instance !== null) {
            this.paymentUppy.removePlugin(instance);
        }
    }
}

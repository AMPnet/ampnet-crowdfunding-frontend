import { AfterViewInit, Component } from '@angular/core';
import * as Uppy from 'uppy';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    DepositSearchResponse,
    WalletCooperativeDepositService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-deposit.service';
import swal from 'sweetalert2';
import { BackendHttpClient } from '../../shared/services/backend-http-client.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { EMPTY } from 'rxjs';

declare var $: any;

@Component({
    selector: 'app-manage-single-deposit',
    templateUrl: './manage-single-deposit.component.html',
    styleUrls: ['./manage-single-deposit.component.css']
})
export class ManageSingleDepositComponent implements AfterViewInit {
    amount = 0;
    amountToConfirm = 0;
    depositModel: DepositSearchResponse;
    paymentUppy: Uppy.Core.Uppy;

    constructor(private route: ActivatedRoute,
                private http: BackendHttpClient,
                private depositCooperativeService: WalletCooperativeDepositService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private router: Router) {
    }

    ngAfterViewInit() {
        this.getDeposit().subscribe();
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
        return this.depositCooperativeService.generateDepositMintTx(this.depositModel.deposit.id).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate(['/dash/manage_deposits']))
        );
    }

    getDeposit() {
        SpinnerUtil.showSpinner();
        const id = this.route.snapshot.params.ID;
        return this.depositCooperativeService.getDeposit(id).pipe(
            displayBackendErrorRx(),
            tap(res => this.depositModel = res),
            switchMap(() => {
                if (!this.depositModel.deposit.approved_at) {
                    setTimeout(() => this.createUploadArea());
                    return EMPTY;
                } else if (!!this.depositModel.deposit.approved_at && !this.depositModel.deposit.tx_hash) {
                    return this.generateSignerAndSign();
                } else {
                    return this.router.navigate(['/dash/manage_deposits']);
                }
            }),
            finalize(() => {
                SpinnerUtil.hideSpinner();
            })
        );
    }

    approveButtonClicked() {
        if (this.amount !== this.amountToConfirm) {
            swal('', 'The deposit amounts don\'t match. Please check the proper deposit amount and try again!',
                'error').then(() => {
                (<any>$('#modal-confirm-deposit')).modal('hide');
                location.reload();
            });
            return;
        }

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

        (<any>$('#modal-confirm-deposit')).modal('hide');

        SpinnerUtil.showSpinner();
        this.paymentUppy.upload().then(res => {
            SpinnerUtil.hideSpinner();
            this.getDeposit().subscribe();
        });
    }
}

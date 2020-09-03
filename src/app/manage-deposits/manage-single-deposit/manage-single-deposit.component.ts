import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import MicroModal from 'micromodal';
import * as numeral from 'numeral';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import { autonumericCurrency, baseCurrencyUnitToCents, stripCurrencyData } from 'src/app/utilities/currency-util';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import swal from 'sweetalert2';
import * as Uppy from 'uppy';
import { BackendHttpClient } from '../../shared/services/backend-http-client.service';
import {
    DepositSearchResponse,
    WalletCooperativeDepositService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-deposit.service';

declare var $: any;

@Component({
    selector: 'app-manage-single-deposit',
    templateUrl: './manage-single-deposit.component.html',
    styleUrls: ['./manage-single-deposit.component.css']
})
export class ManageSingleDepositComponent implements OnInit, AfterViewInit {
    depositModel: DepositSearchResponse;
    paymentUppy: Uppy.Core.Uppy;

    constructor(private route: ActivatedRoute,
                private http: BackendHttpClient,
                private depositCooperativeService: WalletCooperativeDepositService,
                private broadService: BroadcastService,
    ) {

    }

    ngOnInit() {
        this.getDeposit();
    }

    ngAfterViewInit() {
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
            hideUploadButton: true
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
                autonumericCurrency('#deposit-confirm-amount');
            }, 200);

            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    approveButtonClicked() {
        const depositAmount = parseInt(stripCurrencyData($('#deposit-amount').val()), 10);
        const depositConfirmAmount = parseInt(stripCurrencyData($('#deposit-confirm-amount').val()), 10);

        if (depositAmount !== depositConfirmAmount) {
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
            baseCurrencyUnitToCents(depositAmount)
        );

        this.paymentUppy.use(Uppy.XHRUpload, {
            endpoint: depositApprovalURL,
            fieldName: 'file',
            headers: {
                'Authorization': this.http.authHttpOptions().headers.get('Authorization')
            }
        });

        SpinnerUtil.showSpinner();
        this.paymentUppy.upload().then(res => {
            SpinnerUtil.hideSpinner();
            this.getDeposit();
        });
    }
}

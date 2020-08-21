import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../projects/project-service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { autonumericCurrency, stripCurrencyData } from '../utilities/currency-util';
import swal from 'sweetalert2';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { ManagePaymentsService } from '../project/manage-payments/manage-payments.service';
import { BroadcastService } from '../broadcast/broadcast-service';

@Component({
    selector: 'app-revenue-share',
    templateUrl: './revenue-share.component.html',
    styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent implements OnInit {
    @Input() projectName: string;
    @Input() amountInvested: number;
    @Input() amountInvestedConfirm: number;
    @ViewChild('modalConfirmPopupDialog') modalPopupDialog: ElementRef;

    projectID: string;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private managePaymentService: ManagePaymentsService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchDataFromRoute();
        this.formatConfirmPopupInputField();
    }

    fetchDataFromRoute() {
        this.projectID = this.route.snapshot.params.projectID;
        this.amountInvested = this.route.snapshot.params.amount;
        this.getProject(this.projectID);
    }

    getProject(projectUUID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectUUID)
            .subscribe(res => {
                SpinnerUtil.hideSpinner();
                this.projectName = res.name;
            }, error => {
                hideSpinnerAndDisplayError(error);
            });
    }

    confirmButtonClicked() {
        const revenueAmountInvested = parseInt(stripCurrencyData(String(this.amountInvested)), 10);
        const revenueAmountInvestedConfirm = parseInt(stripCurrencyData(String(this.amountInvestedConfirm)), 10);

        if (revenueAmountInvested !== revenueAmountInvestedConfirm) {
            swal('', 'The revenue share amounts don\'t match. Please check the proper amount and try again!',
                'error').then(() => {
                (<any>$('#modal-confirm-revenue')).modal('hide');
                location.reload();
            });
            return;
        }
        this.generateTransactionForRevenuePayout(revenueAmountInvestedConfirm);
    }

    generateTransactionForRevenuePayout(amountInvested: number) {
        SpinnerUtil.showSpinner();
        this.managePaymentService.generateTransactionForRevenuePayout(this.projectID, amountInvested)
            .subscribe(async (res: any) => {
                this.closeConfirmPopupDialog();
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
                        this.closeConfirmPopupDialog();
                    }, err => {
                        hideSpinnerAndDisplayError(err);
                    });
            }, err => {
                hideSpinnerAndDisplayError(err);
            });
    }

    closeConfirmPopupDialog() {
        this.modalPopupDialog.nativeElement.click();
    }

    formatConfirmPopupInputField() {
        autonumericCurrency('#revenue-confirm-amount');
    }
}

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../projects/project-service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { stripCurrencyData } from '../utilities/currency-util';
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
    @ViewChild('modalPopupWindow') modalPopupWindow: ElementRef;

    projectID: string;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private managePaymentService: ManagePaymentsService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchDataFromRoute();
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
        const depositAmount = parseInt(stripCurrencyData(String(this.amountInvested)), 10);
        const depositConfirmAmount = parseInt(stripCurrencyData(String($('#revenue-confirm-amount').val())), 10);

        if (depositAmount !== depositConfirmAmount) {
            swal('', 'The revenue share amounts don\'t match. Please check the proper amount and try again!',
                'error').then(() => {
                (<any>$('#modal-confirm-revenue')).modal('hide');
                location.reload();
            });
            return;
        }
        this.generateTransactionForRevenuePayout();
    }

    generateTransactionForRevenuePayout() {
        SpinnerUtil.showSpinner();
        this.managePaymentService.generateTransactionForRevenuePayout(this.projectID, this.amountInvested)
            .subscribe(async (res: any) => {
                SpinnerUtil.hideSpinner();

                const arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
                const acc = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
                const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                    walletId: acc.wallets[0].id,
                    data: res.tx,
                    type: SignatureRequestType.AETERNITY_RAW
                });
                this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                    .subscribe(_ => {
                        swal('', 'Successful revenue payout. Allow up to 5 min for investment to become visible', 'success');
                        SpinnerUtil.hideSpinner();
                        this.closePopupWindow();
                    }, err => {
                        hideSpinnerAndDisplayError(err);
                    });
            }, err => {
                hideSpinnerAndDisplayError(err);
            });
    }

    closePopupWindow() {
        this.modalPopupWindow.nativeElement.click();
    }
}

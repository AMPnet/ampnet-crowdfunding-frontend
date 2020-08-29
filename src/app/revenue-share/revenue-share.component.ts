import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { stripCurrencyData } from '../utilities/currency-util';
import swal from 'sweetalert2';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { ProjectService } from '../shared/services/project/project.service';
import { BroadcastService } from '../shared/services/broadcast.service';
import { RevenueShareService } from '../shared/services/wallet/revenue-share.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// tslint:disable-next-line:max-line-length
import { RevenueShareConfirmModalComponent } from '../project/manage-payments/revenue-share-confirm-modal/revenue-share-confirm-modal.component';

@Component({
    selector: 'app-revenue-share',
    templateUrl: './revenue-share.component.html',
    styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent implements OnInit {
    projectID: string;
    projectName: string;
    amountInvested: number;
    amountInvestedConfirm: number;
    modalRef: BsModalRef;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private broadcastService: BroadcastService,
                private revenueShareService: RevenueShareService,
                private modalService: BsModalService) {
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

    generateTransactionForRevenuePayout(amountInvested: number) {
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

    showRevenueConfirmModal() {
        this.modalRef = this.modalService.show(RevenueShareConfirmModalComponent);
        this.modalRef.content.onConfirmClicked.subscribe(amount => {
            this.amountInvestedConfirm = amount;
            this.checkInvestedConfirmedAmount();
        });
    }

    checkInvestedConfirmedAmount() {
        const revenueAmountInvested = parseInt(stripCurrencyData(String(this.amountInvested)), 10);
        const revenueAmountInvestedConfirm = parseInt(stripCurrencyData(String(this.amountInvestedConfirm)), 10);

        if (revenueAmountInvested !== revenueAmountInvestedConfirm) {
            swal('', 'The revenue share amounts don\'t match. Please check the proper amount and try again!',
                'error').then(() => {
                location.reload();
            });
            return;
        }
        this.generateTransactionForRevenuePayout(revenueAmountInvestedConfirm);
    }
}

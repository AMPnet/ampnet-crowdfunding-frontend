import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectService } from 'src/app/shared/services/project/project.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { baseCurrencyUnitToCents, prettyCurrency } from 'src/app/utilities/currency-util';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';
import { WalletService } from '../../shared/services/wallet/wallet.service';

@Component({
    selector: 'app-verify-sign-offer',
    templateUrl: './verify-sign-offer.component.html',
    styleUrls: ['./verify-sign-offer.component.css']
})
export class VerifySignOfferComponent implements OnInit {
    projectID: string;
    investAmount: number;
    project: Project;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private walletService: WalletService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit() {
        this.projectID = this.route.snapshot.params.offerID;
        this.investAmount = this.route.snapshot.params.investAmount;
        this.getProject();
    }

    getProject() {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(this.projectID).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.project = res;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    verifyAndSign() {
        SpinnerUtil.showSpinner();
        this.walletService.investToProject(this.project.uuid, this.investAmount)
            .subscribe(async res => {
                const arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
                const acc = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
                const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                    walletId: acc.wallets[0].id,
                    data: res.tx,
                    type: SignatureRequestType.AETERNITY_RAW
                });
                this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                    .subscribe(_ => {
                        this.showAlert();
                        SpinnerUtil.hideSpinner();
                    }, hideSpinnerAndDisplayError);

            }, err => {
                displayBackendError(err);
                SpinnerUtil.hideSpinner();
            });
    }

    showAlert() {
        swal({
            type: 'success',
            title: 'Transaction signed',
            text: 'Transaction is being processed...',
            footer: 'Check your transaction status<a href="/dash/wallet">&nbsp;here</a>'
        }).then(() => this.walletService.clearAndRefreshWallet());
        // This is a hack to fix bug in Sweet Alert lib -> always displays dropdown
        // TODO: This is deprecated and needs to be fixed.
        swal.getContent().getElementsByClassName('swal2-select').item(0).remove();
    }
}


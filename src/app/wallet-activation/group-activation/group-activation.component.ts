import { Component, OnInit } from '@angular/core';
import { Organization, WalletActivationService } from '../../shared/services/wallet/wallet-activation.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-group-activation',
    templateUrl: './group-activation.component.html',
    styleUrls: ['./group-activation.component.css']
})
export class GroupActivationComponent implements OnInit {
    groups: Organization[];

    constructor(private activationService: WalletActivationService,
                private broadService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchWalletToActivate();
    }

    fetchWalletToActivate() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedOrganizationWallets().subscribe((res) => {
            this.groups = res.organizations;
            SpinnerUtil.hideSpinner();
        }, displayBackendError);
    }

    activateGroupClicked(uuid: string) {
        this.activationService.getActivationData(uuid).subscribe(async (res: any) => {
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
                    swal('', 'Success', 'success').then(() => {
                        this.ngOnInit();
                    });
                }, hideSpinnerAndDisplayError);

        }, hideSpinnerAndDisplayError);
    }
}

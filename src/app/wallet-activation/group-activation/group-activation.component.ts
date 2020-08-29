import { Component, OnInit } from '@angular/core';
import {
    OrganizationWallet,
    WalletCooperativeWalletService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
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
    groups: OrganizationWallet[];

    constructor(private activationService: WalletCooperativeWalletService,
                private broadService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchUnactivatedUserWallets();
    }

    fetchUnactivatedUserWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedOrganizationWallets().subscribe((res) => {
            this.groups = res.organizations;
            SpinnerUtil.hideSpinner();
        }, displayBackendError);
    }

    activateGroupClicked(uuid: string) {
        this.activationService.activateWallet(uuid).subscribe(async res => {
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
                        this.fetchUnactivatedUserWallets();
                    });
                }, hideSpinnerAndDisplayError);

        }, hideSpinnerAndDisplayError);
    }
}

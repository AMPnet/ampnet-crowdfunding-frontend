import { Component, OnInit } from '@angular/core';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    CooperativeProject,
    WalletCooperativeWalletService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-project-activation',
    templateUrl: './project-activation.component.html',
    styleUrls: ['./project-activation.component.css']
})
export class ProjectActivationComponent implements OnInit {
    projects: CooperativeProject[];

    constructor(private activationService: WalletCooperativeWalletService,
                private broadService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchUnactivatedUserWallets();
    }

    fetchUnactivatedUserWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedProjectWallets().subscribe((res) => {
            this.projects = res.projects;
            SpinnerUtil.hideSpinner();
        }, displayBackendError);
    }

    activateProjectClicked(uuid: string) {

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
                    swal('', 'Success', 'success')
                        .then(() => this.fetchUnactivatedUserWallets());
                }, hideSpinnerAndDisplayError);

        }, hideSpinnerAndDisplayError);
    }
}

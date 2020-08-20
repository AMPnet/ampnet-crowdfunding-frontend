import { Component, OnInit } from '@angular/core';
import { WalletActivationService } from '../wallet-activation.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { UserActivationModel } from './user-activation.model';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import swal from 'sweetalert2';

@Component({
    selector: 'app-user-activation',
    templateUrl: './user-activation.component.html',
    styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {

    users: UserActivationModel[];

    constructor(private activationService: WalletActivationService,
                private broadService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchWalletToActivate();
    }

    fetchWalletToActivate() {
        SpinnerUtil.showSpinner();
        this.activationService
            .getUnactivatedWallets('user').subscribe((res: any) => {
            this.users = res.users;
            SpinnerUtil.hideSpinner();

        }, displayBackendError);
    }

    async activateUserClicked(id: number) {
        SpinnerUtil.showSpinner();

        this.activationService.getActivationData(id).subscribe(async (res: any) => {
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
                        this.fetchWalletToActivate();
                    });
                }, hideSpinnerAndDisplayError);
        }, hideSpinnerAndDisplayError);
    }
}

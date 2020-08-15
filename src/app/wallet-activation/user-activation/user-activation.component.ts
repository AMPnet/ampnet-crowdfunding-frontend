import { Component, OnInit } from '@angular/core';
import { CooperativeUser, WalletCooperativeWalletService } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import swal from 'sweetalert2';

@Component({
    selector: 'app-user-activation',
    templateUrl: './user-activation.component.html',
    styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {
    users: CooperativeUser[];

    constructor(private activationService: WalletCooperativeWalletService, private broadService: BroadcastService) {
    }

    ngOnInit() {
        SpinnerUtil.showSpinner();

        this.activationService.getUnactivatedUserWallets().subscribe((res) => {
            this.users = res.users;
            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    async activateUserClicked(id: number) {
        SpinnerUtil.showSpinner();

        this.activationService.activateWallet(id).subscribe(async (res: any) => {
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
}

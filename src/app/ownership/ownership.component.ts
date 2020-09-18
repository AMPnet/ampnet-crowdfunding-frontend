import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { WalletCooperativeOwnershipService } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-ownership.service';
import { BroadcastService } from '../shared/services/broadcast.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import swal from 'sweetalert2';
import { TransactionInfo } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { User } from '../shared/services/user/signup.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-ownership',
    templateUrl: './ownership.component.html',
    styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent implements OnInit, OnDestroy {
    user: User;
    userSub: Subscription;

    constructor(private userService: UserService,
                private ownershipService: WalletCooperativeOwnershipService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit() {
        this.userSub = this.userService.user$.subscribe(res => {
            this.user = res;
        }, displayBackendError);
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    changePlatformManagerClicked() {

        const platformManagerAddress: any = $('#platform-manager-address').val();

        this.ownershipService.executePlatformManagerTransaction(platformManagerAddress).subscribe(res => {
            this.confirmAndBroadcastTransaction(res);
        }, hideSpinnerAndDisplayError);
    }

    changeTokenIssuerClicked() {

        const tokenIssuerAddress: any = $('#token-issuer-address').val();

        this.ownershipService.executeTokenIssuerTransaction(tokenIssuerAddress).subscribe(async res => {
            await this.confirmAndBroadcastTransaction(res);
        }, hideSpinnerAndDisplayError);
    }

    async confirmAndBroadcastTransaction(res: TransactionInfo) {
        const arkaneConnect = new ArkaneConnect('AMPnet', {
            environment: 'staging'
        });

        const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);

        const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
            walletId: account.wallets[0].id,
            data: res.tx,
            type: SignatureRequestType.AETERNITY_RAW
        });
        this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
            .subscribe(_ => {
                SpinnerUtil.hideSpinner();
                swal('', 'Success', 'success');
            }, hideSpinnerAndDisplayError);
    }

}

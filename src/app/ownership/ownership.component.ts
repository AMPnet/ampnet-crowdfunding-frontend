import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user-service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { UserModel } from '../models/user-model';
import { OwnershipService } from '../shared/services/wallet/ownership.service';
import { BroadcastService } from '../shared/services/broadcast.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import swal from 'sweetalert2';

@Component({
    selector: 'app-ownership',
    templateUrl: './ownership.component.html',
    styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent implements OnInit {

    user: UserModel;

    constructor(private userService: UserService,
                private ownershipService: OwnershipService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit() {
        this.userService.getOwnProfile().subscribe((res: any) => {
            this.user = res;
        }, hideSpinnerAndDisplayError);
    }

    changePlatformManagerClicked() {

        const platformManagerAddress: any = $('#platform-manager-address').val();

        this.ownershipService.getPlatformManagerTransaction(platformManagerAddress).subscribe(res => {
            this.confirmAndBroadcastTransaction(res);
        }, hideSpinnerAndDisplayError);
    }

    changeTokenIssuerClicked() {

        const tokenIssuerAddress: any = $('#token-issuer-address').val();

        this.ownershipService.getTokenIssuerTransaction(tokenIssuerAddress).subscribe(res => {
            this.confirmAndBroadcastTransaction(res);
        }, hideSpinnerAndDisplayError);
    }

    async confirmAndBroadcastTransaction(res: any) {
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

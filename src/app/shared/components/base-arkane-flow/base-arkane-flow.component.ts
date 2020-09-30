import { Component } from '@angular/core';
import { SpinnerUtil } from '../../../utilities/spinner-utilities';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { displayBackendError, hideSpinnerAndDisplayError } from '../../../utilities/error-handler';
import { WalletService } from '../../services/wallet/wallet.service';
import { BroadcastService } from '../../services/broadcast.service';
import { ArkaneService } from '../../services/arkane.service';
import { catchError, first, map, switchMap, take, takeLast } from 'rxjs/operators';
import { combineLatest, from, Observable, of } from 'rxjs';

@Component({
    selector: 'app-base-arkane-flow',
    template: '',
})
export class BaseArkaneFlowComponent {
    constructor(private walletService: WalletService,
                private broadcastService: BroadcastService,
                private arkaneService: ArkaneService) {
    }

    getArkaneWallet() {

    }


    private getWalletAddress(): Observable<string> {
        return this.walletService.wallet$.pipe(
            takeLast(1), map(wallet => wallet !== null ? wallet.wallet.activation_data : null)
        );
    }



    private initWallet(): Observable<string> {
        return
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
}

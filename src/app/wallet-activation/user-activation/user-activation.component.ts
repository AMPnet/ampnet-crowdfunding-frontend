import { Component, OnInit } from '@angular/core';
import { displayBackendErrorRx, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    CooperativeUser,
    WalletCooperativeWalletService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';


@Component({
    selector: 'app-user-activation',
    templateUrl: './user-activation.component.html',
    styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {
    users: CooperativeUser[];

    constructor(private activationService: WalletCooperativeWalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.fetchUnactivatedUserWallets();
    }

    fetchUnactivatedUserWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedUserWallets()
            .subscribe((res) => {
                this.users = res.users;
                SpinnerUtil.hideSpinner();
            }, hideSpinnerAndDisplayError);
    }

    activateUserClicked(userUUID: string) {
        SpinnerUtil.showSpinner();
        return this.activationService.activateWallet(userUUID).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...',
                customClass: 'popup-success',
                position: 'top',
                confirmButtonText: 'Continue <i class="fas fa-arrow-right ml-3"></i>'
            })),
            tap(() => this.fetchUnactivatedUserWallets()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}

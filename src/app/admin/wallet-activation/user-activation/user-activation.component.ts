import { Component, OnInit } from '@angular/core';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    CooperativeUser,
    WalletCooperativeWalletService
} from '../../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ErrorService } from '../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-user-activation',
    templateUrl: './user-activation.component.html',
    styleUrls: ['./user-activation.component.scss', '../wallet-activation.component.scss']
})
export class UserActivationComponent implements OnInit {
    users: CooperativeUser[];

    constructor(private activationService: WalletCooperativeWalletService,
                private arkaneService: ArkaneService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.fetchUnactivatedUserWallets();
    }

    fetchUnactivatedUserWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedUserWallets().pipe(
            this.errorService.handleError,
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe((res) => {
            this.users = res.users;
        });
    }

    activateUserClicked(userUUID: string) {
        SpinnerUtil.showSpinner();
        return this.activationService.activateWallet(userUUID).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            tap(() => this.fetchUnactivatedUserWallets()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}

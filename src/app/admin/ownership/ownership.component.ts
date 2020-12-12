import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { displayBackendError } from '../../utilities/error-handler';
import { WalletCooperativeOwnershipService } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-ownership.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { User } from '../../shared/services/user/signup.service';
import { Subscription } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-ownership',
    templateUrl: './ownership.component.html',
    styleUrls: ['./ownership.component.scss']
})
export class OwnershipComponent implements OnInit, OnDestroy {
    user: User;
    userSub: Subscription;

    constructor(private userService: UserService,
                private ownershipService: WalletCooperativeOwnershipService,
                private arkaneService: ArkaneService,
                private errorService: ErrorService,
                private popupService: PopupService) {
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
        const platformManagerAddress = String($('#platform-manager-address').val());

        return this.ownershipService.executePlatformManagerTransaction(platformManagerAddress).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    changeTokenIssuerClicked() {
        const tokenIssuerAddress = String($('#token-issuer-address').val());

        return this.ownershipService.executeTokenIssuerTransaction(tokenIssuerAddress).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}

import { Component, OnInit } from '@angular/core';
import {
    OrganizationWallet,
    WalletCooperativeWalletService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { displayBackendError, displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';

@Component({
    selector: 'app-group-activation',
    templateUrl: './group-activation.component.html',
    styleUrls: ['./group-activation.component.css']
})
export class GroupActivationComponent implements OnInit {
    groups: OrganizationWallet[];

    constructor(private activationService: WalletCooperativeWalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.fetchUnactivatedGroupWallets();
    }

    fetchUnactivatedGroupWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedOrganizationWallets().subscribe((res) => {
            this.groups = res.organizations;
            SpinnerUtil.hideSpinner();
        }, displayBackendError);
    }

    activateGroup(groupUUID: string) {
        SpinnerUtil.showSpinner();
        return this.activationService.activateWallet(groupUUID).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...',
                customClass: 'popup-success',
                position: 'top'
            })),
            tap(() => this.fetchUnactivatedGroupWallets()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}

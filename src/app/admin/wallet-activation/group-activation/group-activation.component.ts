import { Component, OnInit } from '@angular/core';
import {
    OrganizationWallet,
    WalletCooperativeWalletService
} from '../../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ErrorService } from '../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-group-activation',
    templateUrl: './group-activation.component.html',
    styleUrls: ['./group-activation.component.scss', '../wallet-activation.component.scss']
})
export class GroupActivationComponent implements OnInit {
    groups: OrganizationWallet[];

    constructor(private activationService: WalletCooperativeWalletService,
                private arkaneService: ArkaneService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.fetchUnactivatedGroupWallets();
    }

    fetchUnactivatedGroupWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedOrganizationWallets().pipe(
            this.errorService.handleError,
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe((res) => {
            this.groups = res.organizations;
        });
    }

    activateGroup(groupUUID: string) {
        SpinnerUtil.showSpinner();
        return this.activationService.activateWallet(groupUUID).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            tap(() => this.fetchUnactivatedGroupWallets()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}

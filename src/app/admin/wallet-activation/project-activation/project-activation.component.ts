import { Component, OnInit } from '@angular/core';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    CooperativeProject,
    WalletCooperativeWalletService
} from '../../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { displayBackendError, displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { PopupService } from '../../../shared/services/popup.service';

@Component({
    selector: 'app-project-activation',
    templateUrl: './project-activation.component.html',
    styleUrls: ['./project-activation.component.css']
})
export class ProjectActivationComponent implements OnInit {
    projects: CooperativeProject[];

    constructor(private activationService: WalletCooperativeWalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.fetchUnactivatedProjectWallets();
    }

    fetchUnactivatedProjectWallets() {
        SpinnerUtil.showSpinner();
        this.activationService.getUnactivatedProjectWallets().subscribe((res) => {
            this.projects = res.projects;
            SpinnerUtil.hideSpinner();
        }, displayBackendError);
    }

    activateProject(projectUUID: string) {
        SpinnerUtil.showSpinner();
        return this.activationService.activateWallet(projectUUID).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            tap(() => this.fetchUnactivatedProjectWallets()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }
}

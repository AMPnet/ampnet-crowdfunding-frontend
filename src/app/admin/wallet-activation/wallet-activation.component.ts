import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from '../../shared/services/popup.service';
import {
    CooperativeProject,
    CooperativeUser,
    CoopWalletActivationService,
    OrganizationWallet
} from '../../shared/services/wallet/wallet-cooperative/coop-wallet-activation.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';

@Component({
    selector: 'app-wallet-activation',
    templateUrl: './wallet-activation.component.html',
    styleUrls: ['./wallet-activation.component.scss']
})
export class WalletActivationComponent implements OnInit {
    users$: Observable<CooperativeUser[]>;
    organizations$: Observable<OrganizationWallet[]>;
    projects$: Observable<CooperativeProject[]>;
    autoRefresh$: Observable<number>;

    refreshUsersSubject = new BehaviorSubject<void>(null);
    refreshOrgsSubject = new BehaviorSubject<void>(null);
    refreshProjectsSubject = new BehaviorSubject<void>(null);

    constructor(private activationService: CoopWalletActivationService,
                private arkaneService: ArkaneService,
                private translate: TranslateService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.users$ = this.refreshUsersSubject.asObservable().pipe(
            switchMap(() => this.activationService.getUserWallets()),
            map(res => res.users)
        );

        this.organizations$ = this.refreshOrgsSubject.asObservable().pipe(
            switchMap(() => this.activationService.getOrgWallets()),
            map(res => res.organizations)
        );

        this.projects$ = this.refreshProjectsSubject.asObservable().pipe(
            switchMap(() => this.activationService.getProjectWallets()),
            map(res => res.projects)
        );

        this.autoRefresh$ = interval(10_000).pipe(
            tap(() => {
                this.refreshUsersSubject.next();
                this.refreshOrgsSubject.next();
                this.refreshProjectsSubject.next();
            })
        );
    }

    private activateWallet(walletUUID: string) {
        SpinnerUtil.showSpinner();
        return this.activationService.activateWallet(walletUUID).pipe(
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    activateUserWallet(walletUUID: string) {
        return this.activateWallet(walletUUID).pipe(
            tap(() => this.refreshUsersSubject.next())
        );
    }

    activateOrgWallet(walletUUID: string) {
        return this.activateWallet(walletUUID).pipe(
            tap(() => this.refreshOrgsSubject.next())
        );
    }

    activateProjectWallet(walletUUID: string) {
        return this.activateWallet(walletUUID).pipe(
            tap(() => this.refreshProjectsSubject.next())
        );
    }
}

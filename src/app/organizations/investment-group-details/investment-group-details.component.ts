import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { Wallet, WalletService } from '../../shared/services/wallet/wallet.service';
import { Organization, OrganizationMember, OrganizationService } from '../../shared/services/project/organization.service';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { RouterService } from '../../shared/services/router.service';

@Component({
    selector: 'app-organization-details',
    templateUrl: './investment-group-details.component.html',
    styleUrls: ['./investment-group-details.component.scss']
})
export class InvestmentGroupDetailsComponent implements OnInit {
    refreshOrganizationSubject = new BehaviorSubject<void>(null);
    refreshOrgWalletSubject = new BehaviorSubject<void>(null);
    refreshOrgMembersSubject = new BehaviorSubject<void>(null);

    organization$: Observable<Organization>;
    orgWallet$: Observable<Wallet>;
    orgMembers$: Observable<OrganizationMember[]>;

    isOverview = false;

    constructor(private activatedRoute: ActivatedRoute,
                private router: RouterService,
                private organizationService: OrganizationService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        const orgID = this.activatedRoute.snapshot.params.id;
        if (this.activatedRoute.snapshot.params.isOverview) {
            this.isOverview = true;
        }
        this.organization$ = this.refreshOrganizationSubject.asObservable().pipe(
            switchMap(() => this.organizationService.getSingleOrganization(orgID)
                .pipe(displayBackendErrorRx()))
        );
        this.orgWallet$ = this.refreshOrgWalletSubject.asObservable().pipe(
            switchMap(() => this.walletService.getOrganizationWallet(orgID).pipe(
                displayBackendErrorRx(),
                catchError(err => {
                    if (err.status === 404) {
                        return this.popupService.new({
                            type: 'info',
                            text: 'The organization wallet needs to be created. You will be prompted now.'
                        }).pipe(
                            switchMap(popupRes => popupRes.dismiss === undefined ?
                                this.createOrgWallet(orgID) : this.recoverBack())
                        );
                    } else {
                        return of(err).pipe(
                            displayBackendErrorRx(),
                            switchMap(() => this.recoverBack())
                        );
                    }
                })))
        );

        this.orgMembers$ = this.refreshOrgMembersSubject.pipe(
            switchMap(_ => this.organizationService.getMembersForOrganization(orgID)
                .pipe(displayBackendErrorRx())),
            map(res => res.members));
    }

    createOrgWallet(orgUUID: string) {
        return this.walletService.createOrganizationWalletTransaction(orgUUID).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            catchError(() => this.recoverBack()),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => of(undefined)),
            tap(() => {
                this.refreshOrganizationSubject.next();
                this.refreshOrgWalletSubject.next();
                this.refreshOrgMembersSubject.next();
            })
        );
    }

    isWalletVerified(orgWallet: Wallet) {
        return !!orgWallet && !!orgWallet?.hash;
    }

    private recoverBack(): Observable<never> {
        this.router.navigate(['/dash/offers']);
        return EMPTY;
    }

    backToGroupsScreen() {
        if (this.isOverview) {
            this.router.navigate(['/overview/discover']);
        } else {
            this.router.navigate(['/dash/offers']);
        }
    }
}

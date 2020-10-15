import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError, displayBackendErrorRx } from 'src/app/utilities/error-handler';
import swal from 'sweetalert2';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { Organization, OrganizationMember, OrganizationService } from '../../shared/services/project/organization.service';
import { BehaviorSubject, EMPTY, from, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';

@Component({
    selector: 'app-organization-details',
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {
    refreshOrgMembersSubject = new BehaviorSubject<void>(null);

    organization$: Observable<Organization>;
    orgWallet$: Observable<WalletDetails>;
    orgMembers$: Observable<OrganizationMember[]>;

    constructor(private activeRoute: ActivatedRoute,
                private organizationService: OrganizationService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        const orgID = this.activeRoute.snapshot.params.id;
        this.organization$ = this.organizationService.getSingleOrganization(orgID).pipe(this.handleErrors);
        this.orgWallet$ = this.walletService.getOrganizationWallet(orgID).pipe(
            catchError(err => {
                if (err.status === 404) {
                    return of(undefined);
                } else if (err.error.err_code === '0851') {
                    swal('', 'The organization is being created. This can take up to a minute. Please check again later.', 'info')
                        .then(() => {
                            window.history.back();
                        });
                } else {
                    displayBackendError(err);
                }
                return EMPTY;
            }));

        this.orgMembers$ = this.refreshOrgMembersSubject.pipe(
            switchMap(_ => this.organizationService.getMembersForOrganization(orgID).pipe(this.handleErrors)),
            map(res => res.members));
    }

    inviteClicked(orgUUID: string, email: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.inviteUser(orgUUID, email).pipe(
            this.handleErrors,
            switchMap(() => from(swal('Success', 'Successfully invited user to organization', 'success'))),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    createOrgWalletClicked(orgID: string) {
        return () => {
            return this.walletService.createOrganizationWalletTransaction(orgID).pipe(
                displayBackendErrorRx(),
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.popupService.new({
                    type: 'success',
                    title: '',
                    text: 'Success!'
                })),
                tap(() => this.ngOnInit()),
            );
        };
    }

    deleteMember(orgID: string, memberID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.removeMemberFromOrganization(orgID, memberID).pipe(
            this.handleErrors,
            switchMap(() => from(swal('Successfully deleted user from the organization', 'success'))),
            tap(() => this.refreshOrgMembersSubject.next()),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    private handleErrors<T>(source: Observable<T>): Observable<T> {
        return source.pipe(
            catchError(err => {
                displayBackendError(err);
                return EMPTY;
            })
        );
    }

    isOrgWalletInitialized(orgWallet: WalletDetails) {
        return orgWallet !== undefined && orgWallet?.hash !== undefined;
    }
}

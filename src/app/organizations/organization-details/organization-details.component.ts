import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
    selector: 'app-organization-details',
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {
    refreshOrgMembersSubject = new BehaviorSubject<void>(null);
    refreshOrgWalletSubject = new BehaviorSubject<void>(null);

    organization$: Observable<Organization>;
    orgWallet$: Observable<WalletDetails>;
    orgMembers$: Observable<OrganizationMember[]>;

    inviteForm: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private organizationService: OrganizationService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private fb: FormBuilder,
                private popupService: PopupService) {
    }

    private static extractEmails(emails: string): string[] {
        return emails
            .split(',').flatMap(comma => comma.trim()
                .split(';')).flatMap(semicolon => semicolon.trim()
                .split(' ')).filter(space => space !== '');
    }

    private static emailsValidator(control: AbstractControl): ValidationErrors | null {
        const emails = OrganizationDetailsComponent.extractEmails(control.value);

        if (emails.length === 0) {
            return {noEmails: true};
        }

        for (let i = 0; i < emails.length; i++) {
            if ((new FormControl(emails[i], Validators.email)).errors) {
                return {incorrectEmail: true};
            }
        }

        return null;
    }

    ngOnInit() {
        const orgID = this.activatedRoute.snapshot.params.id;
        this.organization$ = this.organizationService.getSingleOrganization(orgID).pipe(displayBackendErrorRx());
        this.orgWallet$ = this.refreshOrgWalletSubject.asObservable().pipe(
            switchMap(() => this.walletService.getOrganizationWallet(orgID)),
            catchError(err => {
                if (err.status === 404) {
                    return of(undefined);
                } else if (err.error?.err_code === '0851') {
                    return this.popupService.new({
                        type: 'info',
                        text: 'The organization is being created. This can take up to a minute. ' +
                            'Please check again later.'
                    }).pipe(switchMap(() => this.router.navigate(['/dash/manage_groups'])));
                } else {
                    return of(err).pipe(
                        displayBackendErrorRx(),
                        switchMap(() => this.router.navigate(['/dash/manage_groups']))
                    );
                }
            }));

        this.orgMembers$ = this.refreshOrgMembersSubject.pipe(
            switchMap(_ => this.organizationService.getMembersForOrganization(orgID)
                .pipe(displayBackendErrorRx())),
            map(res => res.members));

        this.inviteForm = this.fb.group({
            emails: ['', OrganizationDetailsComponent.emailsValidator]
        });
    }

    inviteClicked(orgUUID: string) {
        const emails = OrganizationDetailsComponent.extractEmails(this.inviteForm.get('emails').value);

        return this.organizationService.inviteUser(orgUUID, emails).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Success',
                text: 'Successfully invited user to organization'
            })),
            tap(() => this.inviteForm.reset())
        );
    }

    createOrgWalletClicked(orgID: string) {
        return () => {
            return this.walletService.createOrganizationWalletTransaction(orgID).pipe(
                displayBackendErrorRx(),
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.popupService.new({
                    type: 'success',
                    title: 'Transaction signed',
                    text: 'Transaction is being processed...'
                })),
                tap(() => {
                    this.refreshOrgWalletSubject.next();
                    this.refreshOrgMembersSubject.next();
                }),
            );
        };
    }

    deleteMember(orgID: string, memberID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.removeMemberFromOrganization(orgID, memberID).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.new({
                type: 'success',
                text: 'Successfully deleted user from the organization'
            })),
            tap(() => this.refreshOrgMembersSubject.next()),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    isOrgWalletInitialized(orgWallet: WalletDetails) {
        return !!orgWallet && orgWallet?.hash !== undefined;
    }
}

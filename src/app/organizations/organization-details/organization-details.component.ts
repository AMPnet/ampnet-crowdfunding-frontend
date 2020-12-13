import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { Wallet, WalletService } from '../../shared/services/wallet/wallet.service';
import { Organization, OrganizationMember, OrganizationService } from '../../shared/services/project/organization.service';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-organization-details',
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit {
    refreshOrganizationSubject = new BehaviorSubject<void>(null);
    refreshOrgWalletSubject = new BehaviorSubject<void>(null);
    refreshOrgMembersSubject = new BehaviorSubject<void>(null);

    organization$: Observable<Organization>;
    orgWallet$: Observable<Wallet>;
    orgMembers$: Observable<OrganizationMember[]>;

    inviteForm: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
                private router: RouterService,
                private organizationService: OrganizationService,
                private walletService: WalletService,
                private errorService: ErrorService,
                private arkaneService: ArkaneService,
                private translate: TranslateService,
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
        this.organization$ = this.refreshOrganizationSubject.asObservable().pipe(
            switchMap(() => this.organizationService.getSingleOrganization(orgID)
                .pipe(this.errorService.handleError))
        );
        this.orgWallet$ = this.refreshOrgWalletSubject.asObservable().pipe(
            switchMap(() => this.walletService.getOrganizationWallet(orgID).pipe(
                this.errorService.handleError,
                catchError(err => {
                    if (err.status === 404) {
                        return this.popupService.info(
                            'The organization wallet needs to be created. You will be prompted now.'
                        ).pipe(
                            switchMap(popupRes => popupRes.dismiss === undefined ?
                                this.createOrgWallet(orgID) : this.recoverBack())
                        );
                    } else {
                        return of(err).pipe(
                            this.errorService.handleError,
                            switchMap(() => this.recoverBack())
                        );
                    }
                })))
        );

        this.orgMembers$ = this.refreshOrgMembersSubject.pipe(
            switchMap(_ => this.organizationService.getMembersForOrganization(orgID)
                .pipe(this.errorService.handleError)),
            map(res => res.members));

        this.inviteForm = this.fb.group({
            emails: ['', OrganizationDetailsComponent.emailsValidator]
        });
    }

    inviteClicked(orgUUID: string) {
        return () => {
            const emails = OrganizationDetailsComponent.extractEmails(this.inviteForm.get('emails').value);

            return this.organizationService.inviteUser(orgUUID, emails).pipe(
                this.errorService.handleError,
                switchMap(() => this.popupService.success('Successfully invited user to organization')),
                tap(() => this.inviteForm.reset())
            );
        };
    }

    createOrgWallet(orgUUID: string) {
        return this.walletService.createOrganizationWalletTransaction(orgUUID).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            catchError(() => this.recoverBack()),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            switchMap(() => of(undefined)),
            tap(() => {
                this.refreshOrganizationSubject.next();
                this.refreshOrgWalletSubject.next();
                this.refreshOrgMembersSubject.next();
            })
        );
    }

    deleteMember(orgID: string, memberID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.removeMemberFromOrganization(orgID, memberID).pipe(
            this.errorService.handleError,
            switchMap(() => this.popupService.success('Successfully deleted user from the organization')),
            tap(() => this.refreshOrgMembersSubject.next()),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    isWalletVerified(orgWallet: Wallet) {
        return !!orgWallet && !!orgWallet?.hash;
    }

    private recoverBack(): Observable<never> {
        this.router.navigate(['/dash/manage_groups']);
        return EMPTY;
    }

    backToGroupsScreen() {
        this.router.navigate(['/dash/manage_groups']);
    }
}

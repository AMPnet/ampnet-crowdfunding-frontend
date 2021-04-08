import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { User } from '../../shared/services/user/signup.service';
import { Organization, OrganizationMember, OrganizationService } from '../../shared/services/project/organization.service';
import { Wallet, WalletService } from '../../shared/services/wallet/wallet.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import { UserService } from '../../shared/services/user/user.service';
import { ArkaneService } from '../../shared/services/arkane.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from '../../shared/services/popup.service';
import { catchError, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SpinnerUtil } from '../../utilities/spinner-utilities';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
    isPublic: boolean;
    isOverview: boolean;

    refreshOrganizationSubject = new BehaviorSubject<void>(null);
    refreshOrgWalletSubject = new BehaviorSubject<void>(null);
    refreshOrgMembersSubject = new BehaviorSubject<void>(null);

    user$: Observable<User>;
    organization$: Observable<Organization>;
    orgWallet$: Observable<Wallet>;
    orgMembers$: Observable<OrganizationMember[]>;
    writeable$: Observable<{ permission: boolean }>;

    inviteForm: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
                private router: RouterService,
                private userService: UserService,
                private organizationService: OrganizationService,
                private walletService: WalletService,
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
        const emails = GroupComponent.extractEmails(control.value || '');

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
        this.isPublic = this.activatedRoute.snapshot.data.isPublic;
        this.isOverview = this.activatedRoute.snapshot.data.isOverview;
        const orgID = this.activatedRoute.snapshot.params.id;

        this.user$ = this.userService.user$;
        this.organization$ = this.refreshOrganizationSubject.asObservable().pipe(
            switchMap(() => this.organizationService.get(orgID)),
            shareReplay(1),
        );
        this.orgWallet$ = this.refreshOrgWalletSubject.asObservable().pipe(
            switchMap(() => this.walletService.getOrganizationWallet(orgID).pipe(
                catchError(err => {
                    if (err.status === 404) {
                        return this.popupService.info(
                            this.translate.instant('groups.show.wallet_missing')
                        ).pipe(
                            switchMap(popupRes => popupRes.dismiss === undefined ?
                                this.createOrgWallet(orgID) : this.recoverBack())
                        );
                    } else {
                        return of(err).pipe(
                            switchMap(() => this.recoverBack())
                        );
                    }
                })
            )),
            shareReplay(1)
        );

        this.writeable$ = (this.isPublic ? of(false) : this.isOrgOwner).pipe(
            map(permission => ({permission: permission}))
        );

        this.orgMembers$ = combineLatest([this.refreshOrgMembersSubject, this.writeable$]).pipe(
            switchMap(([_, writeable]) => this.organizationService.getMembersForOrganization(orgID, {
                isPublic: this.isPublic || !writeable.permission
            })),
            map(res => res.members));

        this.inviteForm = this.fb.group({
            emails: ['', GroupComponent.emailsValidator]
        });
    }

    private get isOrgOwner() {
        return combineLatest([this.organization$, this.user$]).pipe(
            map(([org, user]) => org.owner_uuid === user.uuid)
        );
    }

    inviteClicked(orgUUID: string) {
        return () => {
            const emails = GroupComponent.extractEmails(this.inviteForm.get('emails').value);

            return this.organizationService.inviteUser(orgUUID, emails).pipe(
                switchMap(() => this.popupService.success(
                    this.translate.instant('groups.show.members.invited')
                )),
                tap(() => this.inviteForm.reset())
            );
        };
    }

    createOrgWallet(orgUUID: string) {
        return this.walletService.createOrganizationWalletTransaction(orgUUID).pipe(
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
            switchMap(() => this.popupService.success(
                this.translate.instant('groups.show.members.deleted')
            )),
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
}

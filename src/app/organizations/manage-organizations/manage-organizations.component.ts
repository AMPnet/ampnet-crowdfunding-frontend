import { Component } from '@angular/core';
import { Organization, OrganizationInvite, OrganizationService } from '../../shared/services/project/organization.service';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { PopupService } from '../../shared/services/popup.service';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-manage-organizations',
    templateUrl: './manage-organizations.component.html',
    styleUrls: ['./manage-organizations.component.scss']
})
export class ManageOrganizationsComponent {
    organizations$: Observable<Organization[]>;
    organizationInvites$: Observable<OrganizationInvite[]>;

    refreshOrganizationsSubject = new BehaviorSubject<void>(null);
    refreshInvitesSubject = new BehaviorSubject<void>(null);

    constructor(private organizationService: OrganizationService,
                private errorService: ErrorService,
                private popupService: PopupService) {
        this.organizations$ = this.refreshOrganizationsSubject.pipe(
            switchMap(_ => this.organizationService.getPersonalOrganizations()
                .pipe(this.errorService.handleError)),
            map(res => res.organizations));

        this.organizationInvites$ = this.refreshInvitesSubject.pipe(
            switchMap(_ => this.organizationService.getMyInvitations()
                .pipe(this.errorService.handleError)),
            map(res => res.organization_invites));
    }

    refreshState() {
        this.refreshOrganizationsSubject.next();
        this.refreshInvitesSubject.next();
    }

    acceptInvite(orgID: string) {
        SpinnerUtil.showSpinner();
        return this.organizationService.acceptInvite(orgID).pipe(
            this.errorService.handleError,
            switchMap(() =>
                this.popupService.success('Accepted invitation to organization')),
            tap(() => this.refreshState()),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }
}

import { Component } from '@angular/core';
import { Organization, OrganizationInvite, OrganizationService } from '../../shared/services/project/organization.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import swal from 'sweetalert2';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-manage-organizations',
    templateUrl: './manage-organizations.component.html',
    styleUrls: ['./manage-organizations.component.css']
})
export class ManageOrganizationsComponent {
    organizations$: Observable<Organization[]>;
    organizationInvites$: Observable<OrganizationInvite[]>;

    refreshOrganizationsSubject = new BehaviorSubject<void>(null);
    refreshInvitesSubject = new BehaviorSubject<void>(null);

    constructor(
        private organizationService: OrganizationService) {

        this.organizations$ = this.refreshOrganizationsSubject.pipe(
            switchMap(_ => this.organizationService.getPersonalOrganizations().pipe(this.handleErrors)),
            map(res => res.organizations));

        this.organizationInvites$ = this.refreshInvitesSubject.pipe(
            switchMap(_ => this.organizationService.getMyInvitations().pipe(this.handleErrors)),
            map(res => res.organization_invites));
    }

    refreshState() {
        this.refreshOrganizationsSubject.next();
        this.refreshInvitesSubject.next();
    }

    acceptInvite(orgID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.acceptInvite(orgID).subscribe(_ => {
            SpinnerUtil.hideSpinner();
            swal('Success', 'Accepted invitation to organization', 'success');
            this.refreshState();
        }, hideSpinnerAndDisplayError);
    }

    private handleErrors<T>(source: Observable<T>) {
        return source.pipe(
            catchError(err => {
                displayBackendError(err);
                return EMPTY;
            })
        );
    }
}

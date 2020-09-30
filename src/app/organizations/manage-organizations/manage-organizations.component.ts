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
    organizationGroup$: Observable<Organization[]>;
    organizationInviteS: Observable<OrganizationInvite[]>;

    refreshOrganizationGroupSubject = new BehaviorSubject<void>(null);
    refreshPersonalOrganizationSubject = new BehaviorSubject<void>(null);

    constructor(
        private organizationService: OrganizationService) {

        this.organizationGroup$ = this.refreshOrganizationGroupSubject.pipe(
            switchMap(_ => this.organizationService.getPersonalOrganizations()),
            map(res => res.organizations)).pipe(this.handleError);

        this.organizationInviteS = this.refreshPersonalOrganizationSubject.pipe(
            switchMap(_ => this.organizationService.getMyInvitations()),
            map(res => res.organization_invites)).pipe(this.handleError);
    }

    refreshState() {
        this.refreshOrganizationGroupSubject.next();
        this.refreshPersonalOrganizationSubject.next();
    }

    acceptInvite(orgID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.acceptInvite(orgID).subscribe(_ => {
            SpinnerUtil.hideSpinner();
            swal('Success', 'Accepted invitation to organization', 'success');
            this.refreshState();
        }, hideSpinnerAndDisplayError);
    }

    private handleError<T>(source: Observable<T>) {
        return source.pipe(
            catchError(err => {
                displayBackendError(err);
                return EMPTY;
            })
        );
    }
}

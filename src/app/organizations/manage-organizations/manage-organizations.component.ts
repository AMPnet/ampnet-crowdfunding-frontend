import { Component, Input, OnInit } from '@angular/core';
import { Organization, OrganizationInvite, OrganizationService } from '../../shared/services/project/organization.service';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import swal from 'sweetalert2';

@Component({
    selector: 'app-manage-organizations',
    templateUrl: './manage-organizations.component.html',
    styleUrls: ['./manage-organizations.component.css']
})
export class ManageOrganizationsComponent implements OnInit {

    @Input()
    organizations: Organization[];

    invitedToOrgs: OrganizationInvite[];

    constructor(
        private organizationService: OrganizationService,
        private router: Router) {
    }

    ngOnInit() {
        this.fetchPersonalOrgs();
        this.fetchOrgInvites();
    }

    refreshState() {
        this.fetchPersonalOrgs();
        this.fetchOrgInvites();
    }

    fetchPersonalOrgs() {
        SpinnerUtil.showSpinner();
        this.organizationService.getPersonalOrganizations().subscribe(res => {
            this.organizations = res.organizations;
            SpinnerUtil.hideSpinner();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    fetchOrgInvites() {
        SpinnerUtil.showSpinner();
        this.organizationService.getMyInvitations().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.invitedToOrgs = res.organization_invites;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    acceptInvite(orgID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.acceptInvite(orgID).subscribe(_ => {
            SpinnerUtil.hideSpinner();
            swal('Success', 'Accepted invitation to organization', 'success');
            this.refreshState();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

}

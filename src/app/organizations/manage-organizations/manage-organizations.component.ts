import { Component, Input, OnInit } from '@angular/core';
import { SingleOrganizationModel } from 'src/app/models/single-organization-model';
import { OrganizationService } from '../organization-service';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { OrgInviteModel } from './org-invite-model';
import swal from 'sweetalert2';

@Component({
    selector: 'app-manage-organizations',
    templateUrl: './manage-organizations.component.html',
    styleUrls: ['./manage-organizations.component.css']
})
export class ManageOrganizationsComponent implements OnInit {

    @Input()
    organizations: SingleOrganizationModel[];

    invitedToOrgs: OrgInviteModel[];

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
        this.organizationService.getPersonalOrganizations().subscribe((res: any) => {
            this.organizations = res.organizations;
            SpinnerUtil.hideSpinner();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    detailsClicked(id: number) {
        this.router.navigate(['organization_details', id]);
    }

    fetchOrgInvites() {
        SpinnerUtil.showSpinner();
        this.organizationService.getMyInvitations().subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            this.invitedToOrgs = res.organization_invites;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    acceptInvite(orgID: number) {
        SpinnerUtil.showSpinner();
        this.organizationService.acceptInvite(orgID).subscribe(res => {
            SpinnerUtil.hideSpinner();
            swal('Success', 'Accepted invitation to organization', 'success');
            this.refreshState();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

}

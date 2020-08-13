import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../shared/services/user/organization-service';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import swal from 'sweetalert2';
import { SingleOrgModel } from '../organization-details/single-org-model';

@Component({
    selector: 'app-approve-organizations',
    templateUrl: './approve-organizations.component.html',
    styleUrls: ['./approve-organizations.component.css']
})
export class ApproveOrganizationsComponent implements OnInit {
    orgsAwaitingApproval: SingleOrgModel[];

    constructor(private orgService: OrganizationService) {
    }

    ngOnInit() {
        this.getOrganizations();
    }

    getOrganizations() {
        SpinnerUtil.showSpinner();
        this.orgService.getAllOrganizations().subscribe((res: any) => {
            const model: SingleOrgModel[] = res.organizations;
            SpinnerUtil.hideSpinner();
            this.filterAndAttachOrgsAwaitingApproval(model);
        }, err => {
            SpinnerUtil.hideSpinner();
        });
    }

    approveOrgClicked(id: number) {
        SpinnerUtil.showSpinner();
        this.orgService.approveOrganization(id).subscribe(res => {
            SpinnerUtil.hideSpinner();
            swal('Success', 'Approved organization "${res.name}"');
            this.getOrganizations();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    private filterAndAttachOrgsAwaitingApproval(orgs: SingleOrgModel[]) {
        this.orgsAwaitingApproval = orgs.filter((org) => {
            return !org.approved && (org.wallet_hash !== undefined);
        });
    }
}

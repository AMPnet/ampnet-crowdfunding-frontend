import { Component, OnInit, Input } from '@angular/core';
import { SingleOrganizationModel } from 'src/app/models/single-organization-model';
import { OrganizationService } from '../organization-service';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { API } from 'src/app/utilities/endpoint-manager';
import { Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css']
})
export class ManageOrganizationsComponent implements OnInit {

  @Input()
  organizations: SingleOrganizationModel[] = [];

  constructor(
    private organizationService: OrganizationService,
    private router: Router) { }

  ngOnInit() {
    this.fetchPersonalOrgs();
  }
  
  fetchPersonalOrgs() {
    SpinnerUtil.showSpinner();
    this.organizationService.getPersonalOrganizations().subscribe((res: any) => {
      this.organizations = res.organizations;
      SpinnerUtil.hideSpinner();
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

  detailsClicked(id: number) {
    this.router.navigate(['organization_details', id])
  }

}

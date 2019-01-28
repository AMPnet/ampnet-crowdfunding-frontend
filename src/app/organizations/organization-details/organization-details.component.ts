import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../organization-service';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private organizationService: OrganizationService) { }

  ngOnInit() {
    this.fetchDetails();
  }

  fetchDetails() {
    let routeParams = this.activeRoute.snapshot.params;
    this.organizationService.getSingleOrganization(routeParams.id).subscribe(res => {
      //alert(JSON.stringify(res));
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

}

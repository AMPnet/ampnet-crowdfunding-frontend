import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../organizations/organization-service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';


declare var _:any;

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {

  manageProjectsModel: ManageProjectsModel[];

  @Input() groupID: number;

  constructor(private router: Router, private orgService: OrganizationService) { }

  onUserClicked() {
    this.router.navigate(['manage_project', '10']);
  }

  ngOnInit() {

    this.manageProjectsModel = _.fill(Array(3), {
      name: "Vjetroelektrana Orjak Greda",
      locationName: "Croatia",
      fundingNeeded: "50000",
      groupOwnerName: "Greenpeace Cro"
    });

  }

  getProjectsForGroup() {
    SpinnerUtil.showSpinner();
    this.orgService.getAllProjectsForOrganization(this.groupID).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

}

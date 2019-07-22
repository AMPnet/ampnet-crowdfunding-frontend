import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../organizations/organization-service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { ProjectModel } from '../projects/create-new-project/project-model';


declare var _:any;

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {

  manageProjectsModel: ProjectModel[];

  @Input() groupID: number;

  constructor(private router: Router, private orgService: OrganizationService) { }

  onUserClicked() {
    this.router.navigate(['manage_project', '10']);
  }

  ngOnInit() {
    this.getProjectsForGroup();

  }

  getProjectsForGroup() {
    SpinnerUtil.showSpinner();
    this.orgService.getAllProjectsForOrganization(this.groupID).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      console.log(res);
      this.manageProjectsModel = res.projects;
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

  

}

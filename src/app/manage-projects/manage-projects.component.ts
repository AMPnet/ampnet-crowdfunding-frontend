import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../shared/services/project/organization.service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { Project, ProjectService } from '../shared/services/project/project.service';


declare var _: any;

@Component({
    selector: 'app-manage-projects',
    templateUrl: './manage-projects.component.html',
    styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {
    projects: Project[];

    @Input() groupID: string;

    constructor(private router: Router,
                private orgService: OrganizationService,
                private projectService: ProjectService) {
    }

    onUserClicked() {
        this.router.navigate(['manage_project', '10']);
    }

    ngOnInit() {
        this.getProjectsForGroup();

    }

    getProjectsForGroup() {
        SpinnerUtil.showSpinner();
        this.orgService.getAllProjectsForOrganization(this.groupID).subscribe((res) => {
            SpinnerUtil.hideSpinner();

            this.projects = res.projects;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    toggleProject(uuid: string) {
        SpinnerUtil.showSpinner();
        const project = this.projects.filter(x => x.uuid === uuid)[0];

        this.projectService.updateProject(project.uuid, {
            active: !project.active
        }).subscribe(() => {
            this.getProjectsForGroup();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }
}

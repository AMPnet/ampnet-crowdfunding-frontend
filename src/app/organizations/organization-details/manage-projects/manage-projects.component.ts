import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../../../shared/services/project/organization.service';
import { displayBackendErrorRx } from '../../../utilities/error-handler';
import { Project, ProjectService } from '../../../shared/services/project/project.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { SpinnerUtil } from '../../../utilities/spinner-utilities';

@Component({
    selector: 'app-manage-projects',
    templateUrl: './manage-projects.component.html',
    styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent {
    @Input() groupID: string;

    refreshProjectsSubject = new BehaviorSubject<void>(null);
    projects$: Observable<Project[]>;

    constructor(private router: Router,
                private orgService: OrganizationService,
                private projectService: ProjectService) {
        this.projects$ = this.refreshProjectsSubject.pipe(
            switchMap(() => this.orgService.getAllProjectsForOrganization(this.groupID)
                .pipe(displayBackendErrorRx())),
            map(res => res.projects)
        );
    }

    toggleProject(uuid: string, projects: Project[]) {
        const project = projects.find(proj => proj.uuid === uuid);
        SpinnerUtil.showSpinner();
        this.projectService.updateProject(project.uuid, {
            active: !project.active
        }).pipe(
            displayBackendErrorRx(),
            tap(() => this.refreshProjectsSubject.next()),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }
}

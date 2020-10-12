import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../shared/services/project/organization.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpinnerUtil } from '../utilities/spinner-utilities';

@Component({
    selector: 'app-manage-projects',
    templateUrl: './manage-projects.component.html',
    styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {
    projects$: Observable<Project[]>;
    refreshProjectsSubject = new BehaviorSubject<void>(null);

    @Input() groupID: string;

    constructor(private router: Router,
                private orgService: OrganizationService,
                private projectService: ProjectService) {
    }

    ngOnInit() {
        this.projects$ = this.refreshProjectsSubject.pipe(
            switchMap(() => this.orgService.getAllProjectsForOrganization(this.groupID).pipe(this.handleErrors)),
            map(res => res.projects));
    }

    toggleProject(uuid: string, projects: Project[]) {
        const project = projects.find(proj => proj.uuid === uuid);
        SpinnerUtil.showSpinner();
        this.projectService.updateProject(project.uuid, {
            active: !project.active
        }).subscribe(() => {
            SpinnerUtil.hideSpinner();
            this.refreshProjectsSubject.next();
        }, hideSpinnerAndDisplayError);
    }

    private handleErrors<T>(source: Observable<T>) {
        return source.pipe(
            catchError(err => {
                displayBackendError(err);
                return EMPTY;
            })
        );
    }
}

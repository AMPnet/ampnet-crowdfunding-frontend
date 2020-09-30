import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../shared/services/project/organization.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-manage-projects',
    templateUrl: './manage-projects.component.html',
    styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {
    project$: Observable<Project[]>;
    refreshProjectsSubject = new BehaviorSubject<void>(null);

    @Input() groupID: string;

    constructor(private router: Router,
                private orgService: OrganizationService,
                private projectService: ProjectService) {
    }

    onUserClicked() {
        this.router.navigate(['manage_project', '10']);
    }

    ngOnInit() {
        this.project$ = this.refreshProjectsSubject.pipe(
            switchMap(() => this.orgService.getAllProjectsForOrganization(this.groupID)),
            map(res => res.projects)).pipe(this.handleError);
    }

    toggleProject(uuid: string, projects: Project[]) {
        const project = projects.filter(x => x.uuid === uuid)[0];

        this.projectService.updateProject(project.uuid, {
            active: !project.active
        }).subscribe(() => {
            this.refreshProjectsSubject.next();
        }, hideSpinnerAndDisplayError);
    }

    private handleError<T>(source: Observable<T>) {
        return source.pipe(
            catchError(err => {
                displayBackendError(err);
                return EMPTY;
            })
        );
    }
}

import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Organization, OrganizationInvite, OrganizationService } from '../shared/services/project/organization.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from '../shared/services/popup.service';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { enterTrigger } from '../shared/animations';
import { Project, ProjectService } from '../shared/services/project/project.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    animations: [enterTrigger]
})
export class ProjectsComponent {
    projects$: Observable<Project[]>;
    groups$: Observable<Organization[]>;
    groupInvites$: Observable<OrganizationInvite[]>;

    refreshProjectsSubject = new BehaviorSubject<void>(null);
    refreshGroupsSubject = new BehaviorSubject<void>(null);
    refreshInvitesSubject = new BehaviorSubject<void>(null);

    constructor(private projectService: ProjectService,
                private organizationService: OrganizationService,
                private translate: TranslateService,
                private popupService: PopupService) {
        this.projects$ = this.refreshProjectsSubject.pipe(
            switchMap(_ => this.projectService.getPersonal()),
            map(res => res.projects));

        this.groups$ = this.refreshGroupsSubject.pipe(
            switchMap(_ => this.organizationService.getPersonal()),
            map(res => res.organizations));

        this.groupInvites$ = this.refreshInvitesSubject.pipe(
            switchMap(_ => this.organizationService.getMyInvitations()),
            map(res => res.organization_invites));
    }

    refreshState() {
        this.refreshProjectsSubject.next();
        this.refreshGroupsSubject.next();
        this.refreshInvitesSubject.next();
    }

    acceptInvite(orgID: string) {
        SpinnerUtil.showSpinner();
        return this.organizationService.acceptInvite(orgID).pipe(
            switchMap(() =>
                this.popupService.success(
                    this.translate.instant('project_management.groups.invites.accepted')
                )),
            tap(() => this.refreshState()),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }
}

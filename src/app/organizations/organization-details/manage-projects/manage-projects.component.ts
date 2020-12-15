import { Component, Input } from '@angular/core';
import { OrganizationService } from '../../../shared/services/project/organization.service';
import { displayBackendErrorRx } from '../../../utilities/error-handler';
import { ProjectWallet } from '../../../shared/services/project/project.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouterService } from '../../../shared/services/router.service';

@Component({
    selector: 'app-manage-projects',
    templateUrl: './manage-projects.component.html',
    styleUrls: ['./manage-projects.component.scss'],
})
export class ManageProjectsComponent {
    @Input() groupID: string;
    @Input() hidePublishBtn = false;

    refreshProjectsSubject = new BehaviorSubject<void>(null);
    projectsWallets$: Observable<ProjectWallet[]>;

    constructor(private router: RouterService,
                private orgService: OrganizationService) {
        this.projectsWallets$ = this.refreshProjectsSubject.pipe(
            switchMap(() => this.orgService.getAllProjectsForOrganization(this.groupID)
                .pipe(displayBackendErrorRx())),
            map(res => res.projects_wallets)
        );
    }
}

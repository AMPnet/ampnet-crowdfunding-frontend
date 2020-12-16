import { Component, Input } from '@angular/core';
import { OrganizationService } from '../../../shared/services/project/organization.service';
import { ProjectWallet } from '../../../shared/services/project/project.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouterService } from '../../../shared/services/router.service';
import { ErrorService } from '../../../shared/services/error.service';

@Component({
    selector: 'app-manage-projects',
    templateUrl: './manage-projects.component.html',
    styleUrls: ['./manage-projects.component.scss'],
})
export class ManageProjectsComponent {
    @Input() groupID: string;

    refreshProjectsSubject = new BehaviorSubject<void>(null);
    projectsWallets$: Observable<ProjectWallet[]>;

    constructor(private router: RouterService,
                private errorService: ErrorService,
                private orgService: OrganizationService) {
        this.projectsWallets$ = this.refreshProjectsSubject.pipe(
            switchMap(() => this.orgService.getAllProjectsForOrganization(this.groupID)
                .pipe(this.errorService.handleError)),
            map(res => res.projects_wallets)
        );
    }
}

import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectWallet } from '../../shared/services/project/project.service';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';
import { OrganizationService } from '../../shared/services/project/organization.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.scss']
})
export class GroupProjectsComponent {
    @Input() groupID: string;
    @Input() isPublic: boolean;

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

import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectService, ProjectWallet } from '../../../../shared/services/project/project.service';
import { MiddlewareService, ProjectWalletInfo } from '../../../../shared/services/middleware/middleware.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrorService } from '../../../../shared/services/error.service';

@Component({
    selector: 'app-single-project-item, [app-single-project-item]',
    templateUrl: './single-project-item.component.html',
    styleUrls: [
        '../manage-projects.component.scss',
        './single-project-item.component.scss'
    ]
})
export class SingleProjectItemComponent implements OnInit {
    @Input() projectWallet: ProjectWallet;
    @Input() hidePublishBtn = false;
    walletInfo$: Observable<ProjectWalletInfo>;

    constructor(private middlewareService: MiddlewareService,
                private errorService: ErrorService,
                private projectService: ProjectService) {
    }

    ngOnInit() {
        this.walletInfo$ = this.middlewareService.getProjectWalletInfoCached(this.projectWallet.wallet?.hash || '');
    }

    toggleProject(project: Project) {
        return () => {
            return this.projectService.updateProject(project.uuid, {
                active: !project.active
            }).pipe(
                this.errorService.handleError,
                tap(updatedProject => this.projectWallet.project = updatedProject)
            );
        };
    }
}

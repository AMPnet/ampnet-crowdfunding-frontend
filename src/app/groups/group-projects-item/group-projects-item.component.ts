import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectService, ProjectWallet } from '../../shared/services/project/project.service';
import { Observable } from 'rxjs';
import { MiddlewareService, ProjectWalletInfo } from '../../shared/services/middleware/middleware.service';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import { tap } from 'rxjs/operators';
import { enterTrigger } from '../../shared/animations';

@Component({
    selector: 'app-group-projects-item, [app-group-projects-item]',
    templateUrl: './group-projects-item.component.html',
    styleUrls: ['./group-projects-item.component.scss'],
    animations: [enterTrigger]
})
export class GroupProjectsItemComponent implements OnInit {
    @Input() projectWallet: ProjectWallet;
    @Input() isPublic: boolean;

    walletInfo$: Observable<ProjectWalletInfo>;

    constructor(private middlewareService: MiddlewareService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: RouterService) {
    }

    ngOnInit() {
        this.walletInfo$ = this.middlewareService.getProjectWalletInfoCached(
            this.projectWallet.wallet?.hash || '');
    }

    toggleProject(project: Project) {
        return () => {
            return this.projectService.updateProject(project.uuid, {
                active: !project.active
            }).pipe(
                tap(updatedProject => this.projectWallet.project = updatedProject)
            );
        };
    }

    onClickedItem() {
        if (this.route.snapshot.data.isOverview) {
            this.router.navigate(['/offers', this.projectWallet.project.uuid]);
        } else {
            if (this.isPublic) {
                this.router.navigate(['/dash/offers', this.projectWallet.project.uuid]);
            } else {
                this.router.navigate(['/dash/projects', this.projectWallet.project.uuid]);
            }
        }
    }
}

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../shared/services/error.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProjectRevenueShareVerifyComponent } from '../project-revenue-share-verify/project-revenue-share-verify.component';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-project-revenue-share',
    templateUrl: './project-revenue-share.component.html',
    styleUrls: ['./project-revenue-share.component.scss']
})
export class ProjectRevenueShareComponent {
    amount: number;

    project$: Observable<Project>;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private errorService: ErrorService,
                private modalService: BsModalService) {
        const projectUUID: string = this.route.snapshot.params.id;
        this.amount = Number(this.route.snapshot.params.amount);

        this.project$ = this.projectService.getProject(projectUUID).pipe(
            this.errorService.handleError,
        );
    }

    showConfirmModal(project: Project) {
        this.modalService.show(ProjectRevenueShareVerifyComponent, {
            initialState: {
                projectUUID: project.uuid,
                amountInvestedConfirm: String(this.amount)
            }
        });
    }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { displayBackendErrorRx } from '../../../../../../utilities/error-handler';
import { Project, ProjectService } from '../../../../../../shared/services/project/project.service';
import { BsModalService } from 'ngx-bootstrap/modal';
// tslint:disable-next-line:max-line-length
import { RevenueShareConfirmModalComponent } from './revenue-share-confirm-modal/revenue-share-confirm-modal.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-revenue-share',
    templateUrl: './revenue-share.component.html',
    styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent {
    orgID: string;
    projectID: string;
    amount: number;

    project$: Observable<Project>;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private modalService: BsModalService) {
        this.orgID = this.route.snapshot.params.groupID;
        this.projectID = this.route.snapshot.params.projectID;
        this.amount = Number(this.route.snapshot.params.amount);

        this.project$ = this.projectService.getProject(this.projectID).pipe(
            displayBackendErrorRx(),
        );
    }

    showConfirmModal() {
        this.modalService.show(RevenueShareConfirmModalComponent, {
            initialState: {
                orgID: this.orgID,
                projectID: this.projectID,
                amountInvestedConfirm: String(this.amount)
            }
        });
    }
}

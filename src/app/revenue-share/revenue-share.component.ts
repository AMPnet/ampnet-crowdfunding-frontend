import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { ProjectService } from '../shared/services/project/project.service';
import { BroadcastService } from '../shared/services/broadcast.service';
import { RevenueShareService } from '../shared/services/wallet/revenue-share.service';
import { BsModalService } from 'ngx-bootstrap/modal';
// tslint:disable-next-line:max-line-length
import { RevenueShareConfirmModalComponent } from '../project/manage-payments/revenue-share-confirm-modal/revenue-share-confirm-modal.component';

@Component({
    selector: 'app-revenue-share',
    templateUrl: './revenue-share.component.html',
    styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent implements OnInit {
    projectID: string;
    projectName: string;
    amountInvested: number;
    amountInvestedConfirm: number;

    constructor(private route: ActivatedRoute,
                private projectService: ProjectService,
                private broadcastService: BroadcastService,
                private revenueShareService: RevenueShareService,
                private modalService: BsModalService) {
    }

    ngOnInit() {
        this.fetchDataFromRoute();
    }

    fetchDataFromRoute() {
        this.projectID = this.route.snapshot.params.projectID;
        this.amountInvested = this.route.snapshot.params.amount;
        this.getProject(this.projectID);
    }

    getProject(projectUUID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectUUID)
            .subscribe(res => {
                SpinnerUtil.hideSpinner();
                this.projectName = res.name;
            }, hideSpinnerAndDisplayError);
    }

    showRevenueConfirmModal() {
        this.modalService.show(RevenueShareConfirmModalComponent, {
            initialState: {
                amountInvestedConfirm: this.amountInvested,
                projectID: this.projectID
            }
        });
    }
}

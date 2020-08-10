import { Component, OnInit } from '@angular/core';
import { RevenueShareService } from './revenue-share.service';
import { ActivatedRoute } from '@angular/router';
import { WalletModel } from 'src/app/organizations/organization-details/organization-model';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { prettyCurrency } from 'src/app/utilities/currency-util';
import * as numeral from 'numeral';
import { ProjectService } from 'src/app/projects/project-service';
import { ProjectModel } from 'src/app/projects/create-new-project/project-model';

@Component({
    selector: 'app-revenue-share',
    templateUrl: './revenue-share.component.html',
    styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent implements OnInit {

    projectWallet: WalletModel;
    projectModel: ProjectModel;

    constructor(private revShareService: RevenueShareService,
                private route: ActivatedRoute, private projectService: ProjectService) {
    }

    ngOnInit() {

        const projID = this.route.snapshot.params.projectID;

        this.getProjectWallet(projID);
        this.getProject(projID);
    }

    getProject(projectID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectID).subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            this.projectModel = res;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    getProjectWallet(projectID: number) {


        SpinnerUtil.showSpinner();
        this.revShareService.getProjectWallet(projectID).subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            this.projectWallet = res;
            this.projectWallet.currency = prettyCurrency(res.currency);
            this.projectWallet.balance = numeral(res.balance).format('0,0');
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

}

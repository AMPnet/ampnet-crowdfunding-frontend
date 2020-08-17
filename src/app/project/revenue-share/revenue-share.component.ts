import { Component, OnInit } from '@angular/core';
import { RevenueShareService } from '../../shared/services/wallet/revenue-share.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { prettyCurrency } from 'src/app/utilities/currency-util';
import * as numeral from 'numeral';
import { Project, ProjectService } from 'src/app/shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Component({
    selector: 'app-revenue-share',
    templateUrl: './revenue-share.component.html',
    styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent implements OnInit {
    projectWallet: WalletDetails;
    project: Project;

    constructor(private revShareService: RevenueShareService,
                private walletService: WalletService,
                private route: ActivatedRoute,
                private projectService: ProjectService) {
    }

    ngOnInit() {
        const projID = this.route.snapshot.params.projectID;

        this.getProjectWallet(projID);
        this.getProject(projID);
    }

    getProject(projectID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectID).subscribe(project => {
            SpinnerUtil.hideSpinner();
            this.project = project;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    getProjectWallet(projectID: number) {
        SpinnerUtil.showSpinner();
        this.walletService.getProjectWallet(projectID).subscribe(res => {
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

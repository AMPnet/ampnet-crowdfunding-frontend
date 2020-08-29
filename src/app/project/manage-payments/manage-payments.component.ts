import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { autonumericCurrency, prettyCurrency } from 'src/app/utilities/currency-util';
import * as numeral from 'numeral';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Component({
    selector: 'app-manage-payments',
    templateUrl: './manage-payments.component.html',
    styleUrls: ['./manage-payments.component.css']
})
export class ManagePaymentsComponent implements OnInit {

    @Input() revenueShareAmount;
    projectWallet: WalletDetails;
    project: Project;

    constructor(private walletService: WalletService,
                private route: ActivatedRoute,
                private router: Router,
                private projectService: ProjectService) {
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
            this.project = res;
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
            autonumericCurrency('#revenueShareAmount');
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    startPayout() {
        const projID = this.route.snapshot.params.projectID;
        const orgID = this.route.snapshot.params.groupID;

        this.router.navigate(['/dash', 'manage_groups', orgID.toString(),
            'manage_project', projID, 'manage_payments', 'revenue_share', this.revenueShareAmount]);
    }
}

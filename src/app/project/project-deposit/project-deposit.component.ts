import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../../shared/services/wallet/deposit-service.service';
import { PlatformBankAccountService } from '../../shared/services/wallet/platform-bank-account.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { displayBackendError, hideSpinnerAndDisplayError } from '../../utilities/error-handler';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-project-deposit',
    templateUrl: './project-deposit.component.html',
    styleUrls: ['./project-deposit.component.css']
})
export class ProjectDepositComponent implements OnInit {

    depositModel: Deposit;
    masterIban: string;

    projectUUID = '';

    constructor(private depositService: DepositServiceService,
                private route: ActivatedRoute,
                private bankAccountService: PlatformBankAccountService) {
    }

    ngOnInit() {
        SpinnerUtil.showSpinner();
        this.projectUUID = this.route.snapshot.params.projectID;
        this.getMasterIban();
        this.depositService.getMyPendingDeposit().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.depositModel = res;
        }, err => {
            SpinnerUtil.hideSpinner();
            if (err.status === 404) {
                this.generateDepositInfo();
            } else {
                displayBackendError(err);
            }
        });
    }

    generateDepositInfo() {
        SpinnerUtil.showSpinner();
        this.depositService.createProjectDeposit(this.projectUUID).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.depositModel = res;
        }, err => {
            SpinnerUtil.hideSpinner();

            if (err.error.err_code === '0509') {
                swal('', 'You already have an existing deposit. Please wait until it\'s approved', 'info');
            } else {
                displayBackendError(err);
            }
        });
    }

    getMasterIban() {
        this.bankAccountService.bankAccounts$.subscribe(res => {
            this.masterIban = res.bank_accounts[0].iban;
        }, err => {
            hideSpinnerAndDisplayError(err);
        });
    }
}

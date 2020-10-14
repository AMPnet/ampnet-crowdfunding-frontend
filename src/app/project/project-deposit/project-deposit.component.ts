import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../../shared/services/wallet/deposit-service.service';
import { PlatformBankAccountService } from '../../shared/services/wallet/platform-bank-account.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { displayBackendError, displayBackendErrorRx } from '../../utilities/error-handler';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
        this.projectUUID = this.route.snapshot.params.projectID;
        this.getMasterIban();
        SpinnerUtil.showSpinner();
        this.depositService.getProjectPendingDeposit(this.projectUUID).pipe(
            catchError(err => {
                if (err.status === 404) {
                    this.generateDepositInfo();
                } else {
                    displayBackendError(err);
                }
                return throwError(err);
            }),
            tap(res => this.depositModel = res),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    generateDepositInfo() {
        SpinnerUtil.showSpinner();
        this.depositService.createProjectDeposit(this.projectUUID).pipe(
            catchError(err => {
                if (err.error.err_code === '0509') {
                    swal('', 'You already have an existing deposit. Please wait until it\'s approved', 'info');
                } else {
                    displayBackendError(err);
                }
                return throwError(err);
            }),
            tap(res => this.depositModel = res),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    getMasterIban() {
        this.bankAccountService.bankAccounts$.pipe(displayBackendErrorRx(),
            tap(res => this.masterIban = res.bank_accounts[0].iban)).subscribe();
    }
}

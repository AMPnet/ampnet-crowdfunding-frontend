import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../shared/services/wallet/deposit-service.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { DepositModel } from './deposit-model';
import swal from 'sweetalert2';
import { PlatformBankAccountService } from '../shared/services/wallet/platform-bank-account.service';

declare var $: any;

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
    depositModel: Deposit;
    masterIban: string;

    projectUUID = '';

    constructor(private depositService: DepositServiceService,
                private bankAccountService: PlatformBankAccountService) {
    }

    ngOnInit() {
        SpinnerUtil.showSpinner();
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
        this.depositService.createDeposit().subscribe(res => {
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
        this.bankAccountService.getBankAccounts().subscribe(res => {
            this.masterIban = res.bank_accounts[0].iban;
        }, err => {
            hideSpinnerAndDisplayError(err);
        });
    }
}

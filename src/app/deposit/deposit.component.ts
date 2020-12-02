import { Component, OnInit } from '@angular/core';
import { Deposit, DepositServiceService } from '../shared/services/wallet/deposit-service.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PopupService } from '../shared/services/popup.service';
import { PlatformBankAccountService } from '../shared/services/wallet/platform-bank-account.service';

declare var $: any;

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
    depositModel: Deposit;
    masterIban: string;

    projectUUID = '';

    constructor(private depositService: DepositServiceService,
                private bankAccountService: PlatformBankAccountService,
                private popupService: PopupService) {
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
                this.popupService.info('You already have an existing deposit. Please wait until it\'s approved');
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

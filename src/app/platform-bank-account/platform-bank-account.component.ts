import { Component, OnInit } from '@angular/core';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { PlatformBankAccount, PlatformBankAccountService } from '../shared/services/wallet/platform-bank-account.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { RouterService } from '../shared/services/router.service';

@Component({
    selector: 'app-platform-bank-account',
    templateUrl: './platform-bank-account.component.html',
    styleUrls: ['./platform-bank-account.component.css']
})
export class PlatformBankAccountComponent implements OnInit {
    banks: PlatformBankAccount[];

    constructor(
        private service: PlatformBankAccountService,
        private router: RouterService) {
    }

    ngOnInit() {
        this.getBankAccounts();
    }

    getBankAccounts() {
        SpinnerUtil.showSpinner();
        this.service.bankAccounts$.subscribe(res => {
            SpinnerUtil.hideSpinner();
            if (res.bank_accounts.length === 0) {
                this.router.navigateCoop(['dash', 'admin', 'platform_bank_account', 'new'], {
                    queryParams: {
                        'status': 'empty'
                    }
                });
            }
            this.banks = res.bank_accounts;
        }, hideSpinnerAndDisplayError);
    }

    deleteBankAccountClicked(id: number) {
        SpinnerUtil.showSpinner();
        this.service.deleteBankAccount(id).subscribe(res => {
            this.getBankAccounts();
        }, hideSpinnerAndDisplayError);
    }
}

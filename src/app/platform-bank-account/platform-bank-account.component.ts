import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { PlatformBankAccountService } from './platform-bank-account.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { BankAccountModel } from '../payment-options/bank-account-model';

@Component({
    selector: 'app-platform-bank-account',
    templateUrl: './platform-bank-account.component.html',
    styleUrls: ['./platform-bank-account.component.css']
})
export class PlatformBankAccountComponent implements OnInit {

    banks: BankAccountModel[];

    constructor(
        private service: PlatformBankAccountService,
        private router: Router) {
    }

    ngOnInit() {
        this.getBankAccounts();
    }

    getBankAccounts() {
        SpinnerUtil.showSpinner();
        this.service.getBankAccounts().subscribe((res: any) => {
            SpinnerUtil.hideSpinner();
            if (res.bank_accounts.length === 0) {
                this.router.navigate(['dash', 'admin', 'platform_bank_account', 'new'], {
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

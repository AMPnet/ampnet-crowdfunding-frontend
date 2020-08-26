import { Component, OnInit } from '@angular/core';
import { PaymentService, UserBankAccount } from '../shared/services/payment.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { Router } from '@angular/router';


@Component({
    selector: 'app-payment-options',
    templateUrl: './payment-options.component.html',
    styleUrls: ['./payment-options.component.css']
})
export class PaymentOptionsComponent implements OnInit {
    banks: UserBankAccount[];

    constructor(private paymentService: PaymentService,
                private router: Router) {
    }

    ngOnInit() {
        this.getBankAccounts();
    }

    getBankAccounts() {
        SpinnerUtil.showSpinner();
        this.paymentService.getMyBankAccounts().subscribe(res => {
            SpinnerUtil.hideSpinner();
            if (res.bank_accounts.length === 0) {
                this.router.navigate(['dash', 'payment_options', 'new'], {
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
        this.paymentService.deleteBankAccount(id).subscribe(res => {
            this.getBankAccounts();
        }, hideSpinnerAndDisplayError);
    }
}

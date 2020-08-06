import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { BankCodeModel } from './bank-code-model';
import 'bootstrap-select';

declare var $: any;

@Component({
    selector: 'app-new-payment-option',
    templateUrl: './new-payment-option.component.html',
    styleUrls: ['./new-payment-option.component.css']
})
export class NewPaymentOptionComponent implements OnInit, AfterViewInit {
    creditCardNavTab: JQuery;
    bankAccountNavTab: JQuery;

    hasNoBankAccounts: boolean;

    bankCodes: BankCodeModel[];

    constructor(private paymentService: PaymentService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.checkStatusAndSetText();

        const file = require('../../../assets/hr-bic.json');
        this.bankCodes = file.list;
    }

    ngAfterViewInit() {
        $('select').selectpicker();

    }

    checkStatusAndSetText() {
        const status = this.route.snapshot.queryParams.status;
        this.hasNoBankAccounts = (status === 'empty');
    }

    addNewBankAccountClicked() {
        const iban: string = (<string>$('#iban-holder').val()).replace(/ /g, '');
        let bankCode: string = (<string>$('#bankcode-holder').val());
        if (bankCode.length === 0) {
            bankCode = 'N/A';
        }
        const alias: string = (<string>$('#alias-holder').val());

        SpinnerUtil.showSpinner();
        this.paymentService.createBankAccount(iban, bankCode, alias).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.router.navigate(['dash', 'payment_options']);
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BankCodeModel } from 'src/app/payment-options/new-payment-option/bank-code-model';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { PlatformBankAccountService } from './../platform-bank-account.service';
import { hideSpinnerAndDisplayError } from '../../utilities/error-handler';

declare var $: any;

@Component({
    selector: 'app-new-platform-bank-account',
    templateUrl: './new-platform-bank-account.component.html',
    styleUrls: ['./new-platform-bank-account.component.css']
})
export class NewPlatformBankAccountComponent implements OnInit, AfterViewInit {
    creditCardNavTab: JQuery;
    bankAccountNavTab: JQuery;

    hasNoBankAccounts: boolean;

    bankCodes: BankCodeModel[];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: PlatformBankAccountService) {
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
        const iban: string = (<string>$('#platform-iban-holder').val()).replace(/ /g, '');
        let bankCode: string = (<string>$('#platform-bankcode-holder').val());
        if (bankCode.length === 0) {
            bankCode = 'N/A';
        }
        const alias: string = (<string>$('#platform-alias-holder').val());

        SpinnerUtil.showSpinner();
        this.service.createBankAccount(iban, bankCode, alias).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.router.navigate(['dash', 'admin', 'platform_bank_account']);
        }, err => {
            hideSpinnerAndDisplayError(err);
        });
    }
}

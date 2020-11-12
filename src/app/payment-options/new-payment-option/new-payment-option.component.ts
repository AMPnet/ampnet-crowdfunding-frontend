import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PaymentService } from '../../shared/services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { BankCodeModel } from './bank-code-model';
import 'bootstrap-select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../../utilities/error-handler';
import { RouterService } from '../../shared/services/router.service';

declare var $: any;

@Component({
    selector: 'app-new-payment-option',
    templateUrl: './new-payment-option.component.html',
    styleUrls: ['./new-payment-option.component.css']
})
export class NewPaymentOptionComponent implements OnInit, AfterViewInit {
    hasNoBankAccounts: boolean;
    bankCodes: BankCodeModel[];

    bankAccountForm: FormGroup;

    constructor(private paymentService: PaymentService,
                private router: RouterService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {

        this.bankAccountForm = this.fb.group({
            iban: ['', [Validators.required]],
            bankCode: ['', [Validators.required]],
            bankAccountAlias: ['', Validators.required]
        });
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
        SpinnerUtil.showSpinner();
        const controls = this.bankAccountForm.controls;
        const iban = controls['iban'].value.replace(/\s/g, '');
        const bankCode = controls['bankCode'].value;
        const alias = controls['bankAccountAlias'].value;
        this.paymentService.createBankAccount(iban, bankCode, alias)
            .subscribe(() => {
                SpinnerUtil.hideSpinner();
                this.router.navigate(['/dash', 'payment_options']);
            }, hideSpinnerAndDisplayError);
    }
}

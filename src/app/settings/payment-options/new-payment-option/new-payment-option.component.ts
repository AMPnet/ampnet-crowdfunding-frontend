import { Component } from '@angular/core';
import { PaymentService } from '../../../shared/services/payment.service';
import 'bootstrap-select';
import { RouterService } from '../../../shared/services/router.service';
import { tap } from 'rxjs/operators';
import { CreateWalletBankAccountData } from '../../../shared/services/wallet/platform-bank-account.service';
import { OnAddNewBankAccountData } from '../../../shared/components/new-bank-account/new-bank-account.component';

declare var $: any;

@Component({
    selector: 'app-new-payment-option',
    templateUrl: './new-payment-option.component.html',
    styleUrls: ['./new-payment-option.component.scss']
})
export class NewPaymentOptionComponent {
    constructor(private paymentService: PaymentService,
                private router: RouterService) {
    }

    addNewBankAccount(data: OnAddNewBankAccountData) {
        const bankAccountData: CreateWalletBankAccountData = {
            iban: data.iban,
            bank_code: data.swift,
            alias: data.alias,
            bank_name: data.bank_name,
            bank_address: data.bank_address,
            beneficiary_name: data.beneficiary_name
        };
        return this.paymentService.createBankAccount(bankAccountData).pipe(
            tap(() => this.router.navigate(['/dash/settings/payment_options']))
        );
    }
}

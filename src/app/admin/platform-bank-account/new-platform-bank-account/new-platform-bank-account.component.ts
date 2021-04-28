import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateWalletBankAccountData, PlatformBankAccountService } from '../../../shared/services/wallet/platform-bank-account.service';
import { RouterService } from '../../../shared/services/router.service';
import { FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { OnAddNewBankAccountData } from '../../../shared/components/new-bank-account/new-bank-account.component';

@Component({
    selector: 'app-new-platform-bank-account',
    templateUrl: './new-platform-bank-account.component.html',
    styleUrls: ['./new-platform-bank-account.component.css']
})
export class NewPlatformBankAccountComponent {
    constructor(private router: RouterService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private service: PlatformBankAccountService) {
    }

    addNewBankAccount(data: OnAddNewBankAccountData) {
        const bankAccountData: CreateWalletBankAccountData = {
            iban: data.iban,
            bank_code: data.swift,
            alias: data.alias,
            bank_name: data.bank_name,
            bank_address: data.bank_address,
            beneficiary_name: data.beneficiary_name,
            beneficiary_address: data.beneficiary_address,
            beneficiary_city: data.beneficiary_city,
            beneficiary_country: data.beneficiary_country,
        };

        return this.service.createBankAccount(bankAccountData).pipe(
            tap(() => this.router.navigate(['/dash/admin/platform_bank_account']))
        );
    }
}

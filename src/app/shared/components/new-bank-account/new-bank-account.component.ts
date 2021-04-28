import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterService } from '../../services/router.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-new-bank-account',
    templateUrl: './new-bank-account.component.html',
    styleUrls: ['./new-bank-account.component.scss']
})
export class NewBankAccountComponent {
    @Input() onAdd: (data: OnAddNewBankAccountData) => Observable<unknown>;

    newBankAccountForm: FormGroup;

    constructor(private router: RouterService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
        this.newBankAccountForm = fb.group({
            iban: ['', Validators.required],
            swift: ['', Validators.required],
            bank_name: ['', Validators.required],
            bank_address: ['', Validators.required],
            beneficiary_name: ['', Validators.required],
            beneficiary_address: ['', Validators.required],
            beneficiary_city: ['', Validators.required],
            beneficiary_country: ['', Validators.required],
        });
    }

    onSubmit() {
        const iban = this.newBankAccountForm.get('iban').value.replace(/\s/g, '');
        const swift = this.newBankAccountForm.get('swift').value;
        const bank_name = this.newBankAccountForm.get('bank_name').value;
        const bank_address = this.newBankAccountForm.get('bank_address').value;
        const beneficiary_name = this.newBankAccountForm.get('beneficiary_name').value;
        const beneficiary_address = this.newBankAccountForm.get('beneficiary_address').value;
        const beneficiary_city = this.newBankAccountForm.get('beneficiary_city').value;
        const beneficiary_country = this.newBankAccountForm.get('beneficiary_country').value;

        const data: OnAddNewBankAccountData = {
            iban, swift, bank_name, bank_address,
            beneficiary_name, beneficiary_address,
            beneficiary_city, beneficiary_country
        };

        return this.onAdd(data);
    }
}

export interface OnAddNewBankAccountData {
    iban: string;
    swift: string;
    alias?: string;
    bank_name: string;
    bank_address: string;
    beneficiary_name: string;
    beneficiary_address: string;
    beneficiary_city: string;
    beneficiary_country: string;
}

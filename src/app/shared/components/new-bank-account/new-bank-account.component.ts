import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterService } from '../../services/router.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-new-bank-account',
    templateUrl: './new-bank-account.component.html',
    styleUrls: ['./new-bank-account.component.css']
})
export class NewBankAccountComponent {
    @Input() onAdd: (iban: string, swift: string, alias: string) => Observable<unknown>;

    newBankAccountForm: FormGroup;

    constructor(private router: RouterService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
        this.newBankAccountForm = fb.group({
            iban: ['', Validators.required],
            swift: ['', Validators.required],
            alias: ['', Validators.required]
        });
    }

    onSubmit() {
        const iban = this.newBankAccountForm.get('iban').value.replace(/\s/g, '');
        const swift = this.newBankAccountForm.get('swift').value;
        const alias = this.newBankAccountForm.get('alias').value;

        return this.onAdd(iban, swift, alias);
    }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformBankAccountService } from '../../../shared/services/wallet/platform-bank-account.service';
import { RouterService } from '../../../shared/services/router.service';
import { FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ErrorService } from '../../../shared/services/error.service';

@Component({
    selector: 'app-new-platform-bank-account',
    templateUrl: './new-platform-bank-account.component.html',
    styleUrls: ['./new-platform-bank-account.component.css']
})
export class NewPlatformBankAccountComponent {
    constructor(private router: RouterService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private errorService: ErrorService,
                private service: PlatformBankAccountService) {
    }

    addNewBankAccount(iban: string, swift: string, alias: string) {
        return this.service.createBankAccount(iban, swift, alias).pipe(
            this.errorService.handleError,
            tap(() => this.router.navigate(['/dash/admin/platform_bank_account']))
        );
    }
}

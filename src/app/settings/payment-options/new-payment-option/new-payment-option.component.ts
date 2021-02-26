import { Component } from '@angular/core';
import { PaymentService } from '../../../shared/services/payment.service';
import 'bootstrap-select';
import { RouterService } from '../../../shared/services/router.service';
import { tap } from 'rxjs/operators';
import { ErrorService } from '../../../shared/services/error.service';

declare var $: any;

@Component({
    selector: 'app-new-payment-option',
    templateUrl: './new-payment-option.component.html',
    styleUrls: ['./new-payment-option.component.scss']
})
export class NewPaymentOptionComponent {
    constructor(private paymentService: PaymentService,
                private errorService: ErrorService,
                private router: RouterService) {
    }

    addNewBankAccount(iban: string, swift: string, alias: string) {
        return this.paymentService.createBankAccount(iban, swift, alias).pipe(
            this.errorService.handleError,
            tap(() => this.router.navigate(['/dash/settings/payment_options']))
        );
    }
}

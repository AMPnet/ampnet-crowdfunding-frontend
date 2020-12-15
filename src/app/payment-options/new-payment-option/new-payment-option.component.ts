import { Component } from '@angular/core';
import { PaymentService } from '../../shared/services/payment.service';
import 'bootstrap-select';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { RouterService } from '../../shared/services/router.service';
import { tap } from 'rxjs/operators';

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

    addNewBankAccount(iban: string, swift: string, alias: string) {
        return this.paymentService.createBankAccount(iban, swift, alias).pipe(
            displayBackendErrorRx(),
            tap(() => this.router.navigate(['/dash/payment_options']))
        );
    }
}

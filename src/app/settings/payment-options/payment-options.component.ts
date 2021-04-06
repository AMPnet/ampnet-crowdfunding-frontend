import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentService, UserBankAccount } from '../../shared/services/payment.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';


@Component({
    selector: 'app-payment-options',
    templateUrl: './payment-options.component.html',
    styleUrls: ['./payment-options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentOptionsComponent {
    private refreshBankAccountsSubject = new BehaviorSubject<void>(null);

    bankAccounts$: Observable<UserBankAccount[]> = this.refreshBankAccountsSubject.pipe(
        switchMap(_ => this.paymentService.getMyBankAccounts().pipe(
            this.errorService.handleError,
        )),
        map(res => res.bank_accounts)
    );

    constructor(private paymentService: PaymentService,
                private errorService: ErrorService,
                private router: RouterService) {
    }

    toNewBankAccount() {
        return this.router.navigate(['/dash/settings/payment_options/new']);
    }

    deleteBankAccountClicked(id: number) {
        this.paymentService.deleteBankAccount(id).subscribe(_ => {
            this.refreshBankAccountsSubject.next();
        });
    }
}

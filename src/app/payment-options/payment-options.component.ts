import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentService, UserBankAccount } from '../shared/services/payment.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouterService } from '../shared/services/router.service';


@Component({
    selector: 'app-payment-options',
    templateUrl: './payment-options.component.html',
    styleUrls: ['./payment-options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentOptionsComponent {
    private refreshBankAccountsSubject = new BehaviorSubject<void>(null);

    bankAccounts$: Observable<UserBankAccount[]> = this.refreshBankAccountsSubject.pipe(
        switchMap(_ => this.paymentService.getMyBankAccounts()),
        map(res => res.bank_accounts)
    );

    constructor(private paymentService: PaymentService,
                private router: RouterService) {
    }

    toNewBankAccount() {
        return this.router.navigateCoop(['/dash/payment_options/new']);
    }

    deleteBankAccountClicked(id: number) {
        this.paymentService.deleteBankAccount(id).subscribe(_ => {
            this.refreshBankAccountsSubject.next();
        });
    }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentService, UserBankAccount } from '../shared/services/payment.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';


@Component({
    selector: 'app-payment-options',
    templateUrl: './payment-options.component.html',
    styleUrls: [
        './../app.component.css',
        './payment-options.component.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentOptionsComponent {
    private refreshBankAccountsSubject = new BehaviorSubject<void>(null);

    bankAccounts$: Observable<UserBankAccount[]> = this.refreshBankAccountsSubject.pipe(
        switchMap(_ => this.paymentService.getMyBankAccounts()),
        map(res => res.bank_accounts)
    );

    constructor(private paymentService: PaymentService,
                private router: Router) {
    }

    toNewBankAccount() {
        return this.router.navigate(['/dash/payment_options/new']);
    }

    deleteBankAccountClicked(id: number) {
        this.paymentService.deleteBankAccount(id).subscribe(_ => {
            this.refreshBankAccountsSubject.next();
        });
    }
}

import { Component } from '@angular/core';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { PlatformBankAccount, PlatformBankAccountService } from '../../shared/services/wallet/platform-bank-account.service';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { RouterService } from '../../shared/services/router.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-platform-bank-account',
    templateUrl: './platform-bank-account.component.html',
    styleUrls: ['./platform-bank-account.component.css']
})
export class PlatformBankAccountComponent {
    refreshBanksSubject = new BehaviorSubject<void>(null);
    banks$: Observable<PlatformBankAccount[]>;

    constructor(private service: PlatformBankAccountService,
                private router: RouterService) {
        this.banks$ = this.refreshBanksSubject.pipe(
            switchMap(() => this.service.bankAccounts$.pipe(displayBackendErrorRx())),
            map(res => res.bank_accounts),
            tap(bankAccounts => {
                if (bankAccounts.length === 0) {
                    this.router.navigate(['/dash/admin/platform_bank_account/new']);
                }
            })
        );
    }

    deleteBankAccountClicked(id: number) {
        SpinnerUtil.showSpinner();
        this.service.deleteBankAccount(id).pipe(
            displayBackendErrorRx(),
            tap(() => this.refreshBanksSubject.next()),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }
}

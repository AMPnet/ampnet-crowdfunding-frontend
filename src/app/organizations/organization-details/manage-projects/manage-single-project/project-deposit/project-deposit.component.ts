import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { Deposit, DepositServiceService } from '../../../../../shared/services/wallet/deposit-service.service';
import { PlatformBankAccountService } from '../../../../../shared/services/wallet/platform-bank-account.service';
import { PopupService } from '../../../../../shared/services/popup.service';
import { RouterService } from '../../../../../shared/services/router.service';
import { ErrorService, WalletError } from '../../../../../shared/services/error.service';

@Component({
    selector: 'app-project-deposit',
    templateUrl: './project-deposit.component.html',
    styleUrls: ['./project-deposit.component.scss']
})
export class ProjectDepositComponent {
    masterIBAN$: Observable<string>;
    deposit$: Observable<Deposit>;

    constructor(private depositService: DepositServiceService,
                private route: ActivatedRoute,
                private router: RouterService,
                private popupService: PopupService,
                private errorService: ErrorService,
                private bankAccountService: PlatformBankAccountService) {
        const projectUUID = this.route.snapshot.params.projectID;

        this.deposit$ = this.depositService.getProjectPendingDeposit(projectUUID).pipe(
            this.errorService.handleError,
            catchError(err => err.status === 404 ? this.generateDepositInfo(projectUUID) : this.navigateBack())
        );

        this.masterIBAN$ = this.bankAccountService.bankAccounts$.pipe(
            this.errorService.handleError,
            map(res => res.bank_accounts[0]?.iban || 'unknown')
        );
    }

    generateDepositInfo(projectUUID: string) {
        return this.depositService.createProjectDeposit(projectUUID).pipe(
            catchError(err =>
                err.error.err_code === WalletError.MISSING_WITHDRAWAL ? this.popupService.info(
                    'You already have an existing deposit. Please wait until it\'s approved'
                ).pipe(switchMap(() => this.navigateBack())) : this.navigateBack()),
            this.errorService.handleError,
        );
    }

    navigateBack(): Observable<never> {
        this.router.navigate(['../../'], {relativeTo: this.route});
        return EMPTY;
    }
}

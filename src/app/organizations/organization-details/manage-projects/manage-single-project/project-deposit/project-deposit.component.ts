import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { Deposit, DepositServiceService } from '../../../../../shared/services/wallet/deposit-service.service';
import { PlatformBankAccountService } from '../../../../../shared/services/wallet/platform-bank-account.service';
import { displayBackendErrorRx } from '../../../../../utilities/error-handler';
import { PopupService } from '../../../../../shared/services/popup.service';
import { RouterService } from '../../../../../shared/services/router.service';

@Component({
    selector: 'app-project-deposit',
    templateUrl: './project-deposit.component.html',
    styleUrls: ['./project-deposit.component.css']
})
export class ProjectDepositComponent {
    masterIBAN$: Observable<string>;
    deposit$: Observable<Deposit>;

    constructor(private depositService: DepositServiceService,
                private route: ActivatedRoute,
                private router: RouterService,
                private popupService: PopupService,
                private bankAccountService: PlatformBankAccountService) {
        const projectUUID = this.route.snapshot.params.projectID;

        this.deposit$ = this.depositService.getProjectPendingDeposit(projectUUID).pipe(
            displayBackendErrorRx(),
            catchError(err => err.status === 404 ? this.generateDepositInfo(projectUUID) : this.recoverBack())
        );

        this.masterIBAN$ = this.bankAccountService.bankAccounts$.pipe(
            displayBackendErrorRx(),
            map(res => res.bank_accounts[0]?.iban || 'unknown')
        );
    }

    generateDepositInfo(projectUUID: string) {
        return this.depositService.createProjectDeposit(projectUUID).pipe(
            displayBackendErrorRx(),
            catchError(err =>
                err.error.err_code === '0509' ? this.popupService.new({
                    type: 'info',
                    text: 'You already have an existing deposit. Please wait until it\'s approved'
                }).pipe(switchMap(() => this.recoverBack())) : this.recoverBack())
        );
    }

    private recoverBack(): Observable<never> {
        this.router.navigateCoop(['../'], {relativeTo: this.route});
        return EMPTY;
    }
}

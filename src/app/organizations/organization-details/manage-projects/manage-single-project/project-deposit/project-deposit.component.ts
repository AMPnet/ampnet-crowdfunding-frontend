import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { Deposit, DepositServiceService } from '../../../../../shared/services/wallet/deposit-service.service';
import { PlatformBankAccount, PlatformBankAccountService } from '../../../../../shared/services/wallet/platform-bank-account.service';
import { PopupService } from '../../../../../shared/services/popup.service';
import { RouterService } from '../../../../../shared/services/router.service';
import { ErrorService, WalletError } from '../../../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from '../../../../../shared/services/app-config.service';

@Component({
    selector: 'app-project-deposit',
    templateUrl: './project-deposit.component.html',
    styleUrls: ['./project-deposit.component.scss']
})
export class ProjectDepositComponent {
    orgID: string;

    deposit$: Observable<Deposit>;
    bankAccount$: Observable<PlatformBankAccount>;

    constructor(public appConfig: AppConfigService,
                private depositService: DepositServiceService,
                private route: ActivatedRoute,
                private router: RouterService,
                private popupService: PopupService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private bankAccountService: PlatformBankAccountService) {
        const projectUUID = this.route.snapshot.params.projectID;
        this.orgID = this.route.snapshot.params.groupID;

        this.deposit$ = this.depositService.getProjectPendingDeposit(projectUUID).pipe(
            this.errorService.handleError,
            catchError(err => err.status === 404 ? this.generateDepositInfo(projectUUID) : this.recoverBack())
        );

        this.bankAccount$ = this.bankAccountService.bankAccounts$.pipe(
            this.errorService.handleError,
            map(res => res.bank_accounts[0]),
            shareReplay(1)
        );
    }

    generateDepositInfo(projectUUID: string) {
        return this.depositService.createProjectDeposit(projectUUID).pipe(
            catchError(err =>
                err.error.err_code === WalletError.UNAPPROVED_DEPOSIT_EXISTS ? this.popupService.info(
                    this.translate.instant('projects.edit.manage_payments.deposit.existing_deposit')
                ).pipe(switchMap(() => this.recoverBack())) : this.recoverBack()),
            this.errorService.handleError,
        );
    }

    private recoverBack(): Observable<never> {
        this.router.navigate(['../'], {relativeTo: this.route});
        return EMPTY;
    }
}

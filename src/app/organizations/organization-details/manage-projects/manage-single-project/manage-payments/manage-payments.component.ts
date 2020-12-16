import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { MiddlewareService, ProjectWalletInfo } from '../../../../../shared/services/middleware/middleware.service';
import { Project, ProjectService } from '../../../../../shared/services/project/project.service';
import { WalletService } from '../../../../../shared/services/wallet/wallet.service';
import { Observable, of } from 'rxjs';
import { RouterService } from '../../../../../shared/services/router.service';
import { ErrorService } from '../../../../../shared/services/error.service';

@Component({
    selector: 'app-manage-payments',
    templateUrl: './manage-payments.component.html',
    styleUrls: ['./manage-payments.component.scss']
})
export class ManagePaymentsComponent {
    project$: Observable<Project>;
    projectWalletInfo$: Observable<ProjectWalletInfo>;

    revenueShareForm: FormGroup;

    @Input() showProjectTitle = true;

    constructor(private walletService: WalletService,
                private route: ActivatedRoute,
                private router: RouterService,
                private projectService: ProjectService,
                private errorService: ErrorService,
                private fb: FormBuilder,
                private middlewareService: MiddlewareService) {
        const projectID = this.route.snapshot.params.projectID;

        this.project$ = this.projectService.getProject(projectID).pipe(this.errorService.handleError);

        this.projectWalletInfo$ = this.walletService.getProjectWallet(projectID).pipe(
            switchMap(wallet => this.middlewareService.getProjectWalletInfoCached(wallet.hash)
                .pipe(this.errorService.handleError)),
            shareReplay({refCount: true, bufferSize: 1})
        );

        this.revenueShareForm = this.fb.group({
            amount: [0, [Validators.required], [this.amountValidator.bind(this)]]
        });
    }

    private amountValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.projectWalletInfo$.pipe(
            map(walletInfo => walletInfo.balance),
            catchError(() => of(0)),
            map(balance => {
                const inputAmount = control.value;

                if (inputAmount > balance || inputAmount <= 0) {
                    return {inputAmountInvalid: true};
                }

                return null;
            })
        );
    }

    isProjectFullyFunded(walletInfo: ProjectWalletInfo) {
        return !!walletInfo && walletInfo.totalFundsRaised === walletInfo.investmentCap;
    }
}

import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MiddlewareService, ProjectWalletInfo } from '../../shared/services/middleware/middleware.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-project-edit-payments',
    templateUrl: './project-edit-payments.component.html',
    styleUrls: ['./project-edit-payments.component.scss']
})
export class ProjectEditPaymentsComponent {
    projectWalletInfo$: Observable<ProjectWalletInfo>;

    revenueShareForm: FormGroup;

    constructor(private walletService: WalletService,
                private route: ActivatedRoute,
                private router: RouterService,
                private fb: FormBuilder,
                private middlewareService: MiddlewareService) {
        const projectUUID = this.route.snapshot.params.id;

        this.projectWalletInfo$ = this.walletService.getProjectWallet(projectUUID).pipe(
            switchMap(wallet => this.middlewareService.getProjectWalletInfoCached(wallet.hash)),
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

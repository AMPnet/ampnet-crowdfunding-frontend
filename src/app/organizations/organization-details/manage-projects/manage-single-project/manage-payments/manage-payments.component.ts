import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { MiddlewareService, ProjectWalletInfo } from '../../../../../shared/services/middleware/middleware.service';
import { WalletService } from '../../../../../shared/services/wallet/wallet.service';
import { Observable, of } from 'rxjs';
import { RouterService } from '../../../../../shared/services/router.service';

@Component({
    selector: 'app-manage-payments',
    templateUrl: './manage-payments.component.html',
    styleUrls: ['./manage-payments.component.scss']
})
export class ManagePaymentsComponent {
    projectWalletInfo$: Observable<ProjectWalletInfo>;

    revenueShareForm: FormGroup;

    constructor(private walletService: WalletService,
                private route: ActivatedRoute,
                private router: RouterService,
                private fb: FormBuilder,
                private middlewareService: MiddlewareService) {
        const projectID = this.route.snapshot.params.projectID;


        this.projectWalletInfo$ = this.walletService.getProjectWallet(projectID).pipe(
            switchMap(wallet => this.middlewareService.getProjectWalletInfoCached(wallet.hash).pipe(displayBackendErrorRx())),
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

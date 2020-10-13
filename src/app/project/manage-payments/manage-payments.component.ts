import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MiddlewareService } from '../../shared/services/middleware/middleware.service';
import { finalize, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-manage-payments',
    templateUrl: './manage-payments.component.html',
    styleUrls: ['./manage-payments.component.css']
})
export class ManagePaymentsComponent implements OnInit {
    projectWallet: WalletDetails;
    project: Project;
    projectID;

    isProjectFullyFunded = false;
    revenueForm: FormGroup;
    groupID;

    constructor(private walletService: WalletService,
                private route: ActivatedRoute,
                private router: Router,
                private projectService: ProjectService,
                private fb: FormBuilder,
                private middlewareService: MiddlewareService) {

        this.revenueForm = this.fb.group({
            amount: ['', [Validators.required, this.amountValidator.bind(this)]]
        });
    }

    ngOnInit() {
        this.projectID = this.route.snapshot.params.projectID;
        this.groupID = this.route.snapshot.params.groupID;
        this.getProjectWallet(this.projectID);
        this.getProject(this.projectID);
    }

    getProject(projectID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectID).pipe(displayBackendErrorRx(),
            tap(res => this.project = res),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    getProjectWallet(projectID: number) {
        SpinnerUtil.showSpinner();
        this.walletService.getProjectWallet(projectID).pipe(displayBackendErrorRx(),
            tap(wallet => this.projectWallet = wallet),
            switchMap(_wallet => this.middlewareService.getProjectWalletInfoCached(_wallet.hash).pipe(displayBackendErrorRx())),
            tap(res => this.isProjectFullyFunded = res.investmentCap === res.totalFundsRaised),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    private amountValidator(control: AbstractControl): ValidationErrors | null {
        const inputAmount = control.value;
        const walletBalance = this.projectWallet?.balance || 0;

        if (inputAmount > walletBalance || inputAmount <= 0) {
            return {inputAmountInvalid: true};
        }

        return null;
    }
}

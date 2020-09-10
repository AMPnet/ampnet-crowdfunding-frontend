import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { autonumericCurrency, centsToBaseCurrencyUnit, prettyCurrency, stripCurrencyData } from 'src/app/utilities/currency-util';
import * as numeral from 'numeral';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-manage-payments',
    templateUrl: './manage-payments.component.html',
    styleUrls: ['./manage-payments.component.css']
})
export class ManagePaymentsComponent implements OnInit {
    projectWallet: WalletDetails;
    project: Project;

    revenueForm: FormGroup;

    constructor(private walletService: WalletService,
                private route: ActivatedRoute,
                private router: Router,
                private projectService: ProjectService,
                private fb: FormBuilder) {

        this.revenueForm = this.fb.group({
            amount: ['', [Validators.required, this.amountValidator.bind(this)]]
        });
    }

    ngOnInit() {
        const projID = this.route.snapshot.params.projectID;
        this.getProjectWallet(projID);
        this.getProject(projID);
    }

    getProject(projectID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectID)
            .subscribe(res => this.project = res, displayBackendError)
            .add(SpinnerUtil.hideSpinner);
    }

    getProjectWallet(projectID: number) {
        SpinnerUtil.showSpinner();
        this.walletService.getProjectWallet(projectID)
            .subscribe(res => {
                this.projectWallet = res;
                this.projectWallet.currency = prettyCurrency(res.currency);
                this.projectWallet.balance = numeral(centsToBaseCurrencyUnit(res.balance)).format('0,0');
                autonumericCurrency('#revenueShareAmount');
            }, err => {
                displayBackendError(err);
            })
            .add(SpinnerUtil.hideSpinner);
    }

    startPayout() {
        const projID = this.route.snapshot.params.projectID;
        const orgID = this.route.snapshot.params.groupID;

        this.router.navigate([
            `/dash/manage_groups/${orgID}/manage_project/${projID}
            /manage_payments/revenue_share/${this.revenueForm.controls['amount'].value}`]);
    }

    private amountValidator(control: AbstractControl): { [key: string]: any } | null {
        const inputAmount = Number(stripCurrencyData(control.value.toString()));
        const walletBalance = Number(stripCurrencyData((this.projectWallet?.balance || 0).toString()));

        if (inputAmount > walletBalance || inputAmount <= 0) {
            return {inputAmountInvalid: true};
        }

        return null;
    }
}

import { Component, OnInit } from '@angular/core';
import numeral from 'numeral';
import { WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
    autonumericCurrency,
    baseCurrencyUnitToCents,
    centsToBaseCurrencyUnit,
    prettyCurrency,
    stripCurrencyData
} from '../utilities/currency-util';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

declare var $: any;

@Component({
    selector: 'app-invest',
    templateUrl: './invest.component.html',
    styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {
    inputValue: string;

    yearlyReturn: string;
    projectStake: string;
    breakevenPeriod: string;
    wallet: WalletDetails;
    project: Project;
    expectedROI: number;

    investmentOutOfBoundsWarningMessage = '';

    INVEST_LOW_MSG = '<i class="fas fa-exclamation-triangle mr-3"></i><b>Investment amount too low</b>. The minimum investment is ';
    INVEST_HIGH_MSG = '<i class="fas fa-exclamation-triangle mr-3"></i><b>Investment amount too high</b>. The maximum investment is ';
    WALLET_LOW_MSG = '<i class="fas fa-exclamation-triangle mr-3"></i>' +
        '<b>You don\'t have enough funds on your wallet</b>. Please deposit funds in the wallet tab.';

    constructor(private walletService: WalletService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.expectedROI = 10.5;
        this.getWalletBalance();
    }

    getWalletBalance() {
        SpinnerUtil.showSpinner();
        this.walletService.wallet$.subscribe(res => {
            if (res.state === WalletState.EMPTY) {
                return;
            }

            this.wallet = res.wallet;

            setTimeout(() => {
                autonumericCurrency('#amount-input');
                SpinnerUtil.hideSpinner();
            }, 200);
            this.getProject();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    getProject() {
        const id = this.route.snapshot.params.id;
        SpinnerUtil.showSpinner();
        this.projectService.getProject(id).subscribe(res => {
            res.currency = prettyCurrency(res.currency);
            this.project = res;

            this.project.min_per_user = centsToBaseCurrencyUnit(res.min_per_user);
            this.project.max_per_user = centsToBaseCurrencyUnit(res.max_per_user);

            this.investmentOutOfBoundsWarningMessage
                = this.INVEST_LOW_MSG + res.currency + this.project.min_per_user + '. ';
            SpinnerUtil.hideSpinner();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    investButtonClicked() {
        this.router.navigate(['./',
                baseCurrencyUnitToCents(Number(stripCurrencyData(this.inputValue))), 'verify_sign'],
            {relativeTo: this.route});
    }

    inputChanged(event: any) {
        let inputValue = parseInt(stripCurrencyData(this.inputValue), 10);

        if (inputValue === NaN) {
            inputValue = 0;
        }

        // this.inputValue = numeral(inputValue).format('0,0,0');
        this.yearlyReturn = numeral(this.calculateYearlyReturn(inputValue)).format('0,0.00');
        this.projectStake = this.calculateProjectStake(inputValue)
            .toFixed(4) + '%';
        this.breakevenPeriod = numeral(this.calculateTotalLifetimeReturn(inputValue)).format('0,0');

        if (inputValue < this.project.min_per_user) {
            this.investmentOutOfBoundsWarningMessage =
                this.INVEST_LOW_MSG + this.project.currency + this.project.min_per_user + '. ';
        } else if (inputValue > this.project.max_per_user) {
            this.investmentOutOfBoundsWarningMessage =
                this.INVEST_HIGH_MSG + this.project.currency + this.project.max_per_user + '. ';
        } else {
            this.investmentOutOfBoundsWarningMessage = '';
        }

        if (inputValue > this.wallet.balance) {
            let padding = '';
            if (this.investmentOutOfBoundsWarningMessage.length > 0) {
                padding = '<br><br>';
            }
            this.investmentOutOfBoundsWarningMessage += (padding + (this.WALLET_LOW_MSG));
        }

        const inputAmount = $('#amount-input');
        const inputAmountContent: String = inputAmount.val();

    }

    calculateProjectStake(investment: number): number {
        const total = this.project.expected_funding;
        return (investment / total) * 100;
    }

    calculateYearlyReturn(investment: number): number {
        const maxReturn = this.expectedROI;
        return investment * (maxReturn / 100);
    }

    calculateTotalLifetimeReturn(investment): number {
        return this.calculateYearlyReturn(investment) * 25;
    }

}

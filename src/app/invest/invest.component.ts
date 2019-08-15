import { Component, OnInit, OnChanges } from '@angular/core';
import { InvestViewModel } from './invest-view-model';
import numeral from 'numeral';
import { WalletService } from '../wallet/wallet.service';
import { InvestService } from './invest.service';
import { displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { WalletModel } from '../models/WalletModel';
import { ProjectModel } from '../projects/create-new-project/project-model';
import { ProjectService } from '../projects/project-service';
import { ActivatedRoute, Router } from '@angular/router';
import { prettyCurrency, autonumericCurrency, stripCurrencyData } from '../utilities/currency-util';
import Cleave from 'cleave.js'
import * as Autonumeric from 'autonumeric'

declare var $:any;

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
  wallet: WalletModel;
  project: ProjectModel;
  expectedROI: number;

  investmentOutOfBoundsWarningMessage = ""

  INVEST_LOW_MSG = "Investment amount too low. The minimum investment is "
  INVEST_HIGH_MSG = "Investment amount too high. The maximum investment is "

  constructor(private walletService: WalletService, private investService: InvestService,
    private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.expectedROI = 7.5;
    this.getWalletBalance();
    this.getProject();

    
  }


  getWalletBalance() {
    SpinnerUtil.showSpinner();
    this.walletService.getWallet().subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.wallet = res;
      this.wallet.currency = prettyCurrency(res.currency);
      this.wallet.balance = numeral(res.balance).format("0,0");

      setTimeout(() => {
        autonumericCurrency("#amount-input")
      }, 200)
      
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

  getProject() {
    let id = this.route.snapshot.params.id;
    SpinnerUtil.showSpinner();
    this.projectService.getProject(id).subscribe((res: any) => {
      res.currency = prettyCurrency(res.currency);
      this.project = res;
      
      this.investmentOutOfBoundsWarningMessage 
        = this.INVEST_LOW_MSG + res.currency + this.project.min_per_user
      SpinnerUtil.hideSpinner();
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

  investButtonClicked() {
    this.router.navigate(["./", stripCurrencyData(this.inputValue), "verify_sign"],
    {
      relativeTo: this.route
    })
  }

  inputChanged(event: any) {

    var inputValue = parseInt(
      stripCurrencyData(this.inputValue)
    )

    if(inputValue == NaN) { 
      inputValue = 0
    }
    console.log(inputValue)
    //this.inputValue = numeral(inputValue).format('0,0,0');
    this.yearlyReturn = numeral(this.calculateYearlyReturn(inputValue)).format('0,0.00'); 
    this.projectStake = this.calculateProjectStake(inputValue)
                          .toFixed(4) + "%";
    this.breakevenPeriod = numeral(this.calculateTotalLifetimeReturn(inputValue)).format('0,0');
    
    if(inputValue < this.project.min_per_user) {
      this.investmentOutOfBoundsWarningMessage =
        this.INVEST_LOW_MSG + this.project.currency + this.project.min_per_user
    } else if (inputValue > this.project.max_per_user) {
      this.investmentOutOfBoundsWarningMessage = 
        this.INVEST_HIGH_MSG + this.project.currency + this.project.max_per_user
    } else {
      this.investmentOutOfBoundsWarningMessage = ""
    }

    let inputAmount = $("#amount-input")
    let inputAmountContent: String = inputAmount.val();

    
    
  }
  
  calculateProjectStake(investment: number): number {
    let total = this.project.expected_funding;
    return (investment / total) * 100;
  } 

  calculateYearlyReturn(investment: number): number {
    let maxReturn = this.expectedROI;
    return investment * (maxReturn / 100);
  }

  calculateTotalLifetimeReturn(investment): number {
    return this.calculateYearlyReturn(investment) * 20;
  } 

}

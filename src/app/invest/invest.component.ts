import { Component, OnInit } from '@angular/core';
import { InvestViewModel } from './invest-view-model';
import numeral from 'numeral';
import { WalletService } from '../wallet/wallet.service';
import { InvestService } from './invest.service';
import { displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { WalletModel } from '../models/WalletModel';


@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {

  private viewModel: InvestViewModel;
  inputValue: string;

  yearlyReturn: string;
  projectStake: string;
  breakevenPeriod: string;

  wallet: WalletModel;

  constructor(private walletService: WalletService, private investService: InvestService) { }

  ngOnInit() {
    this.viewModel = {
      projectName: "Orjak",
      minInvestment: 1000,
      maxInvestment: 500000,
      totalInvestment: 21000000,
      currentlyInvested: 14250100,
      expectedReturnMin: 5.5,
      expectedReturnMax: 6.5,
      projectLifetime: 30
    };
    this.getWalletBalance();
  }

  getWalletBalance() {
    SpinnerUtil.showSpinner();
    this.walletService.getWallet().subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.wallet = res;
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

  inputChanged(event: any) {
    let inputValue = parseInt(this.inputValue);
    //this.inputValue = numeral(inputValue).format('0,0,0');
    this.yearlyReturn = numeral(this.calculateYearlyReturn(inputValue)).format('0,0.00'); 
    this.projectStake = this.calculateProjectStake(inputValue)
                          .toFixed(4) + "%";
    this.breakevenPeriod = numeral(this.calculateTotalLifetimeReturn(inputValue)).format('0,0');
    
  }
  
  calculateProjectStake(investment: number): number {
    let total = this.viewModel.totalInvestment;
    return (investment / total) * 100;
  } 

  calculateYearlyReturn(investment: number): number {
    let maxReturn = this.viewModel.expectedReturnMax;
    return investment * (maxReturn / 100);
  }

  calculateTotalLifetimeReturn(investment): number {
    return this.calculateYearlyReturn(investment) * this.viewModel.projectLifetime;
  } 

}

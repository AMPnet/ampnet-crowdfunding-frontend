import { Component, OnInit } from '@angular/core';
import { InvestViewModel } from './invest-view-model';
import numeral from 'numeral';
import { WalletService } from '../wallet/wallet.service';
import { InvestService } from './invest.service';
import { displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { WalletModel } from '../models/WalletModel';
import { ProjectModel } from '../projects/create-new-project/project-model';
import { ProjectService } from '../projects/project-service';
import { ActivatedRoute } from '@angular/router';
import { prettyCurrency } from '../utilities/currency-util';
import Cleave from 'cleave.js'

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

  constructor(private walletService: WalletService, private investService: InvestService,
    private projectService: ProjectService, private route: ActivatedRoute) { }

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
      
      SpinnerUtil.hideSpinner();
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

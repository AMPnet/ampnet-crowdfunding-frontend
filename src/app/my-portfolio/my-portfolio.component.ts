import { Component, OnInit } from '@angular/core';
import { InvestItemModel } from './single-invest-item/InvestItemModel';
import * as _ from 'lodash';
import { PortfolioService } from './portfolio.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PortfolioRoot, PortfolioStats } from './portfolio.models'
import { WalletService } from '../wallet/wallet.service';


@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html',
  styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {

  constructor(private portfolioService: PortfolioService,
    private walletService: WalletService) { }

    
  hasWallet = false;
  portfolio: PortfolioRoot[];
  stats: PortfolioStats;
  roi: number = 0;

  ngOnInit() {
    
    this.getTransactions()
  }

  getTransactions() {
    SpinnerUtil.showSpinner()

    this.walletService.getWallet().subscribe((res: any) => {

      if(res.hash != undefined) { // Check if wallet was activated by admin

        this.portfolioService.getPortfolioStats().subscribe((res: any) => {
          this.hasWallet = true;
          this.stats = res;
          if(this.stats.investments > 0) {
            this.roi = ((this.stats.earnings + this.stats.investments) / (this.stats.investments) - 1) * 100
          }
          SpinnerUtil.showSpinner()
          this.portfolioService.getPortfolio().subscribe((res: any) => {
            this.portfolio = res.portfolio;
            SpinnerUtil.hideSpinner()
          }, hideSpinnerAndDisplayError)
        }, hideSpinnerAndDisplayError)

      } else {
        SpinnerUtil.hideSpinner()
      }

    }, err => {
      SpinnerUtil.hideSpinner()
    })
    

    
  }

}

import { Component, OnInit } from '@angular/core';
import { InvestItemModel } from './single-invest-item/InvestItemModel';
import * as _ from 'lodash';
import { PortfolioService } from './portfolio.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PortfolioRoot, PortfolioStats } from './portfolio.models'


@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html',
  styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {

  constructor(private portfolioService: PortfolioService) { }

  portfolio: PortfolioRoot[];
  stats: PortfolioStats;
  roi: number = 0;

  ngOnInit() {
    
    this.getTransactions()
  }

  getTransactions() {
    SpinnerUtil.showSpinner()
    

    this.portfolioService.getPortfolioStats().subscribe((res: any) => {

      this.stats = res;
      this.roi = ((this.stats.earnings + this.stats.investments) / (this.stats.investments) - 1) * 100;
      SpinnerUtil.showSpinner()
      this.portfolioService.getPortfolio().subscribe((res: any) => {
        this.portfolio = res.portfolio;
        SpinnerUtil.hideSpinner()
      }, hideSpinnerAndDisplayError)
    }, hideSpinnerAndDisplayError)
  }

}

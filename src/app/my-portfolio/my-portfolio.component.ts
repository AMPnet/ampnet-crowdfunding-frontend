import { Component, OnInit } from '@angular/core';
import { InvestItemModel } from './single-invest-item/InvestItemModel';
import * as _ from 'lodash';
import { PortfolioService } from './portfolio.service';
import { displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';



@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html',
  styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {

  constructor(private portfolioService: PortfolioService) { }

  investments: InvestItemModel[];

  ngOnInit() {
    this.investments = _.fill(Array(5), {
      title: 'ABC',
      offeredBy: 'Greenpeace',
      country: 'Greece',
      amountInvested: 3400,
      headerImage: 'https://assets.rbl.ms/6470364/980x.jpg'
    });
    this.getTransactions()
  }

  getTransactions() {
    SpinnerUtil.showSpinner()
    this.portfolioService.getInvestments().subscribe(res => {
      console.log(res)
      SpinnerUtil.hideSpinner()
    }, err => {
      displayBackendError(err)
      SpinnerUtil.hideSpinner()
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ProposalModel } from '../models/ProposalModel';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { PortfolioService } from '../my-portfolio/portfolio.service';
import { ActivatedRoute } from '@angular/router';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PortfolioRoot, InvestmentsInProject } from '../my-portfolio/portfolio.models';
import { prettyDate } from '../utilities/date-format-util';
import { autonumericCurrency } from '../utilities/currency-util';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.component.html',
  styleUrls: ['./investment-details.component.css']
})
export class InvestmentDetailsComponent implements OnInit {

  constructor(private portfolioService: PortfolioService,
    private activatedRoute: ActivatedRoute) { }


  public investment: InvestmentsInProject

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params.id;

    SpinnerUtil.showSpinner()
    this.portfolioService.getInvestmentsInProject(id).subscribe((res: any) => {
      this.investment = res;
      this.investment.transactions.map((v,i,a) => {
        var newV = v;
        newV.date = prettyDate(v.date)
        return newV
      })
      SpinnerUtil.hideSpinner()
    }, hideSpinnerAndDisplayError)
  }

}

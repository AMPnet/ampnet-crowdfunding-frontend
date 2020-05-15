import { Component, OnInit } from '@angular/core';
import "bootstrap-select"
import { PortfolioService } from '../my-portfolio/portfolio.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PortfolioRoot } from '../my-portfolio/portfolio.models';
import numeral from 'numeral'

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {

  portfolio: PortfolioRoot[];
  selectedProjectIndex = -1;
  remainingShares = "";
  personalShares = "";
  totalShares = "";
  sharesForSale = "";

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    SpinnerUtil.showSpinner();

    this.portfolioService.getPortfolio().subscribe((res:any) => {
      this.portfolio = res.portfolio;
      SpinnerUtil.hideSpinner();
      
      setTimeout(() => {
        (<any>$("select")).selectpicker();
        
      }, 200)

    }, hideSpinnerAndDisplayError);


  }

  onChangeSelect(item: any) {
    this.selectedProjectIndex = item;
    let folioItem = this.portfolio[item];
    this.personalShares = this.numeralFormat(folioItem.investment)
    this.totalShares = this.numeralFormat(folioItem.project.expected_funding)
  
  }

  onChangeInput(value: number) {
    this.remainingShares = this.numeralFormat(this.portfolio[this.selectedProjectIndex].investment - value)
    this.sharesForSale = this.numeralFormat(value);
  }

  numeralFormat(input: number) : string {
    return numeral(input).format('0,0')
  }

}

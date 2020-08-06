import { Component, OnInit } from '@angular/core';
import 'bootstrap-select';
import { PortfolioService } from '../my-portfolio/portfolio.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { PortfolioRoot } from '../my-portfolio/portfolio.models';
import numeral from 'numeral';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {

  portfolio: PortfolioRoot[];
  selectedProjectIndex = -1;
  remainingShares = '';
  personalShares = '';
  totalShares = '';
  sharesForSale = '';
  pricePaidFor = '';
  suggestedSalePrice = '';

  constructor(private portfolioService: PortfolioService) {
  }

  ngOnInit() {
    SpinnerUtil.showSpinner();

    this.portfolioService.getPortfolio().subscribe((res: any) => {
      this.portfolio = res.portfolio;
      SpinnerUtil.hideSpinner();

      setTimeout(() => {
        (<any>$('select')).selectpicker();

      }, 200);

    }, hideSpinnerAndDisplayError);


  }

  onChangeSelect(item: any) {
    this.selectedProjectIndex = item;
    const folioItem = this.portfolio[item];
    this.personalShares = this.numeralFormat(folioItem.investment);
    this.totalShares = this.numeralFormat(folioItem.project.expected_funding);

  }

  onChangeInput(value: number) {
    const folioItem = this.portfolio[this.selectedProjectIndex];

    this.remainingShares = this.numeralFormat(folioItem.investment - value);
    this.sharesForSale = this.numeralFormat(value);
    this.pricePaidFor = this.numeralFormat(value / 100);
    this.suggestedSalePrice = this.numeralFormat((value / 100) * 0.7);
  }

  numeralFormat(input: number): string {
    return numeral(input).format('0,0');
  }

}

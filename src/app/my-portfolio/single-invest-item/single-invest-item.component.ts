import { Component, OnInit, Input } from '@angular/core';
import { InvestItemModel } from './InvestItemModel';
import { Router } from '@angular/router';
import { PortfolioRoot } from '../portfolio.models';
import { prettyCurrency, autonumericCurrency, centsToBaseCurrencyUnit } from 'src/app/utilities/currency-util';

@Component({
  selector: 'app-single-invest-item',
  templateUrl: './single-invest-item.component.html',
  styleUrls: ['./single-invest-item.component.css']
})
export class SingleInvestItemComponent implements OnInit {

  @Input() investment: PortfolioRoot;

  constructor(private router: Router) { }

  ngOnInit() {
    this.investment.project.currency = prettyCurrency(this.investment.project.currency)
    this.investment.investment = centsToBaseCurrencyUnit(this.investment.investment)
  }

  onClickedItem() {
    
    this.router.navigate(['dash', 'my_portfolio', this.investment.project.uuid, "in_portfolio"]);
  }

  getImageAsURL() {
    console.log(this.investment.project)
    return "url(" + (<any>this.investment.project).image_url + ")"
  }

}

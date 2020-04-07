import { Component, OnInit, Input } from '@angular/core';
import { InvestItemModel } from './InvestItemModel';
import { Router } from '@angular/router';
import { PortfolioRoot } from '../portfolio.models';

@Component({
  selector: 'app-single-invest-item',
  templateUrl: './single-invest-item.component.html',
  styleUrls: ['./single-invest-item.component.css']
})
export class SingleInvestItemComponent implements OnInit {

  @Input() investment: PortfolioRoot;

  constructor(private router: Router) { }

  ngOnInit() {
    
  }

  onClickedItem() {
    this.router.navigate(['dash', 'my_portfolio', this.investment.project.uuid]);
  }

  getImageAsURL() {
    console.log(this.investment.project)
    return "url(" + (<any>this.investment.project).image_url + ")"
  }

}

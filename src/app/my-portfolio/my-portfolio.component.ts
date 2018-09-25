import { Component, OnInit } from '@angular/core';
import { InvestItemModel } from './single-invest-item/InvestItemModel';
import * as _ from 'lodash';



@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html',
  styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {

  constructor() { }

  investments: InvestItemModel[];

  ngOnInit() {
  	this.investments = _.fill(Array(5), {
  		title: 'ABC',
  		offeredBy: 'Greenpeace',
  		country: 'Greece',
  		amountInvested: 3400,
  		headerImage: 'https://assets.rbl.ms/6470364/980x.jpg'
  	});
  }

}

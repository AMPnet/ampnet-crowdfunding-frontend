import { Component, OnInit } from '@angular/core';
import { InvestItemModel } from './single-invest-item/InvestItemModel';
import * as _ from 'lodash';

declare var feather: any;

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor() { }

  investments: InvestItemModel[];

  ngOnInit() {
  	feather.replace();
  	this.investments = _.fill(Array(5), {
  		title: "ABC",
  		offeredBy: "Greenpeace",
  		country: "Greece",
  		amountInvested: 3400,
  		headerImage: "https://assets.rbl.ms/6470364/980x.jpg"
  	});
  }

}

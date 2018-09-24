import { Component, OnInit, Input } from '@angular/core';
import { InvestItemModel } from './InvestItemModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-invest-item',
  templateUrl: './single-invest-item.component.html',
  styleUrls: ['./single-invest-item.component.css']
})
export class SingleInvestItemComponent implements OnInit {

	@Input() investment: InvestItemModel;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClickedItem() {
  	this.router.navigate(['dash', 'my_portfolio', 'investment_details']);
  }

}

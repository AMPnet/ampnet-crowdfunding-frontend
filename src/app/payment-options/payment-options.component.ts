import { Component, OnInit } from '@angular/core';
import { PaymentOptionModel, PaymentOptionType } from '../models/PaymentOptionModel'
import * as _ from 'lodash';

declare var feather: any;

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.css']
})
export class PaymentOptionsComponent implements OnInit {

	paymentOptions: PaymentOptionModel[];

  constructor() {
  	this.paymentOptions = _.fill(Array(3), {
  		name: "PBZ Account",
  		type: PaymentOptionType.bankAccount,
  		active: true
  	});
  }

  ngOnInit() {
		
  }

  ngAfterViewInit() {
  	feather.replace();
  }

}

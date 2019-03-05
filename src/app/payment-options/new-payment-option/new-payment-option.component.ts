import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-new-payment-option',
  templateUrl: './new-payment-option.component.html',
  styleUrls: ['./new-payment-option.component.css']
})
export class NewPaymentOptionComponent implements OnInit {

  creditCardNavTab: JQuery;
  bankAccountNavTab: JQuery;

  constructor() { }

  ngOnInit() {
    $('#bank-account-input').hide();
  }

  tabToggle(position: number) {
    $('.tab-holder li a').removeClass('tab-active');
    const activeElem = $($('.tab-holder li a').get(position));
    activeElem.addClass('tab-active');
    const dataShow = activeElem.attr('data-show');

    $('.option-content-holder .payment-option-form').hide(300);
    $(`#${dataShow}`).show(300);
  }

}

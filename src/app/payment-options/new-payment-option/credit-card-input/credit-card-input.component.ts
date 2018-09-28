import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card-input',
  templateUrl: './credit-card-input.component.html',
  styleUrls: ['./credit-card-input.component.css']
})
export class CreditCardInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tabToggle(position: number) {
    $('.tab-holder li a').removeClass('active-second');
    $($('.tab-holder li a').get(position)).addClass('active-second');
  }
}

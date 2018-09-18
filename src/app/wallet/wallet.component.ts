import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

declare var feather: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	feather.replace()
  }

  depositButtonClicked() {
  
  }

}

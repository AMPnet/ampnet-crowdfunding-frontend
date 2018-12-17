import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TxHistoryModel, TxHistoryType } from '../../models/TransactionHistoryModel';
import * as _ from 'lodash';



@Component({
  selector: 'app-wallet-tx-history',
  templateUrl: './wallet-tx-history.component.html',
  styleUrls: ['./wallet-tx-history.component.css']
})
export class WalletTxHistoryComponent implements OnInit, AfterViewInit {

  txHistoryModel: TxHistoryModel[];

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {

  }

}

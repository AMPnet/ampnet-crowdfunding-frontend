import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TxHistoryModel, TxHistoryType } from '../../models/TransactionHistoryModel';


@Component({
  selector: 'app-wallet-tx-history',
  templateUrl: './wallet-tx-history.component.html',
  styleUrls: ['./wallet-tx-history.component.css']
})
export class WalletTxHistoryComponent implements OnInit, AfterViewInit {

  txHistoryModel: TxHistoryModel[] = [];

  constructor() {

  }

  ngOnInit() {
    const model = [{
      amount: 100,
      date: new Date(),
      position: 1,
      type: TxHistoryType.Deposit
    }];
    const repet = Array(4).fill(model);
    this.txHistoryModel = repet;
  }

  ngAfterViewInit() {

  }

}

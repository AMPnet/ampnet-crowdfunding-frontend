import { Component, OnInit } from '@angular/core';
import { TxHistoryModel, TxHistoryType } from '../../models/TransactionHistoryModel';

@Component({
  selector: 'app-wallet-tx-history',
  templateUrl: './wallet-tx-history.component.html',
  styleUrls: ['./wallet-tx-history.component.css']
})
export class WalletTxHistoryComponent implements OnInit {

	txHistoryModel: TxHistoryModel[];

  constructor() { }

  ngOnInit() {
  	this.txHistoryModel = _.fill(Array(20), {
  		position: 0,
  		date: new Date(),
  		amount: 200,
  		type: TxHistoryType.Deposit
  	});
  }

}

import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { WalletService } from './wallet.service';
import swal from 'sweetalert2';
import { WalletModel } from '../models/WalletModel';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private walletService: WalletService) { }

  private walletModel: WalletModel;

  ngOnInit() {
    this.fetchWallet();
  }

  depositButtonClicked() {
  
  }

  fetchWallet() {
    this.walletService.getWallet().subscribe(res => {
      this.walletModel = res;
    }, err => {
     if(err.status != 404) {
       swal("Error", err.message, "error");
     }
    })
  }

  walletIsInitialized(): boolean {
    return this.walletModel != null;
  }

  initWallet() {  
    this.walletService.initWallet().subscribe(res => {
      this.walletModel = res;
    }, err => {
      swal("Error", err.message, "error");
    });
  }

}

import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { WalletService } from './wallet.service';
import swal from 'sweetalert2';
import { WalletModel } from '../models/WalletModel';
import { SpinnerUtil } from '../utilities/spinner-utilities';


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
    SpinnerUtil.showSpinner();
    this.walletService.getWallet().subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.walletModel = res;
    }, err => {
      SpinnerUtil.hideSpinner();
     if(err.status != 404) {
       swal("", err.message, "warning");
     }
    })
  }

  walletIsInitialized(): boolean {
    return this.walletModel != null;
  }

  initWallet() {  
    SpinnerUtil.showSpinner();
    this.walletService.initWallet().subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.walletModel = res;
    }, err => {
      SpinnerUtil.hideSpinner();
      swal("", err.error.message, "warning");
    });
  }

}

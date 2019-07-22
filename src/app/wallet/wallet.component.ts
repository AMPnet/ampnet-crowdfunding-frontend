import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { WalletService } from './wallet.service';
import swal from 'sweetalert2';
import { WalletModel } from '../models/WalletModel';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { prettyCurrency } from '../utilities/currency-util';
import * as numeral from 'numeral';
import * as QRCode from 'qrcode';
import { API } from '../utilities/endpoint-manager';

declare var $:any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, AfterViewInit {

  constructor(private walletService: WalletService) { }

  wallet: WalletModel;
  checkComplete = false;

  ngOnInit() {
    

    this.getUserWallet();

  }

  ngAfterViewInit() {
    QRCode.toCanvas(document.getElementById("url-pairing-canvas"), API.APIURL, 
      console.log);
  }

  submitClicked() {
    let addr = $("#addr").val();
    let pubKey = $("#pubkey").val();

    this.walletService.initWallet(addr, pubKey).subscribe(res => {
      alert(JSON.stringify(res));
    }, err => {
      alert(err);
    });
  }

  getUserWallet() {
    SpinnerUtil.showSpinner();
    this.walletService.getWallet().subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.wallet = res;
      this.wallet.currency = prettyCurrency(res.currency);
      this.wallet.balance = numeral(res.balance).format('0,0');
      this.checkComplete = true;
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
      this.checkComplete = true;
    });
  }

}

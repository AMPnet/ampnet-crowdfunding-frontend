import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { WalletService } from './wallet.service';
import swal from 'sweetalert2';
import { WalletModel } from '../models/WalletModel';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError, displayErrorMessage } from '../utilities/error-handler';
import { prettyCurrency } from '../utilities/currency-util';
import * as numeral from 'numeral';
import * as QRCode from 'qrcode';
import { API } from '../utilities/endpoint-manager';
import { ChildActivationEnd } from '@angular/router';
import { ArkaneConnect, Wallet, SecretType } from '@arkane-network/arkane-connect'
import { AuthenticationResult } from '@arkane-network/arkane-connect/dist/src/connect/connect';

declare var $:any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private walletService: WalletService) { }

  wallet: WalletModel;
  checkComplete = false;

  arkaneConnect: ArkaneConnect;

  ngOnInit() {
    this.getUserWallet();
  }

  setUpArkane() {
    let arkaneConnect = new ArkaneConnect("AMPnet", { environment: "staging"})
    arkaneConnect.flows.getAccount(SecretType.AETERNITY).then(acc => {
      if((acc.wallets != undefined) && (acc.wallets.length > 0)) {
        this.startWalletInit(acc.wallets[0].address)
      }
    })
  }


  startWalletInit(addr: string) {
    SpinnerUtil.showSpinner();
    this.walletService.initWallet(addr).subscribe(res => {
      SpinnerUtil.hideSpinner();
      this.getUserWallet();
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

  getUserWallet() {
    SpinnerUtil.showSpinner();
    this.walletService.getWallet().subscribe(res => {
      this.wallet = res;
      this.wallet.currency = prettyCurrency(res.currency);
      this.wallet.balance = numeral(res.balance).format('0,0');
      this.wallet.activated_at = res.activated_at;
      this.checkComplete = true;
      SpinnerUtil.hideSpinner();
    }, err => {
      SpinnerUtil.hideSpinner();
      this.checkComplete = true;
    });
  }

}

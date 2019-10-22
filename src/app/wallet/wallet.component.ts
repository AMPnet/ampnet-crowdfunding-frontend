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
import { ArkaneConnect } from '@arkane-network/arkane-connect'
import { AuthenticationResult } from '@arkane-network/arkane-connect/dist/src/connect/connect';

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

  arkaneConnect: ArkaneConnect;

  ngOnInit() {
    this.getUserWallet();
  }

  ngAfterViewInit() {
    

  }

  async setUpArkane() {
    SpinnerUtil.showSpinner();    
    try {
      this.arkaneConnect = new ArkaneConnect('Arketype', {
        environment: 'staging'
      })
      const authResult = await this.arkaneConnect.checkAuthenticated()
      this.afterAuth(authResult)
    } catch (reason) {
      console.error(reason);
      SpinnerUtil.hideSpinner();
      displayErrorMessage("Cannot connect to secure wallet provider")
    }
  }

  afterAuth(authResult: AuthenticationResult) {
    authResult.authenticated(async (auth) => {
        try {
          const wallets = await this.arkaneConnect.api.getWallets();
          if(wallets.length > 0) {
            const wallet = wallets[0]
            this.startWalletInit(wallet.address, "0xC2D7CF95645D33006175B78989035C7c9061d3F9")
          } else {
            SpinnerUtil.hideSpinner();
            this.arkaneConnect.manageWallets("ETHEREUM")
          }
        } catch (err) {
          SpinnerUtil.hideSpinner();
          displayErrorMessage("Somethign went wrong while authenticating your secure account.")
        }
    })
    .notAuthenticated(async (auth) => {
      const authResult = await this.arkaneConnect.flows.authenticate();
      this.afterAuth(authResult)
    })
  }

  startWalletInit(addr: string, pubKey: string) {
    SpinnerUtil.showSpinner();
    this.walletService.initWallet(addr, pubKey).subscribe(res => {
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
      SpinnerUtil.hideSpinner();
      this.wallet = res;
      this.wallet.currency = prettyCurrency(res.currency);
      this.wallet.balance = numeral(res.balance).format('0,0');
      this.checkComplete = true;
    }, err => {
      SpinnerUtil.hideSpinner();
      this.checkComplete = true;
    });
  }

}

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
import { ChildActivationEnd } from '@angular/router';

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
    this.bindInputs();

  }

  bindInputs() {
    var inputs = $(".pairing-code-holder").children();
    
    inputs.each((i, item) => {
      $(item).keyup((e) => {
        let isBackspace = e.keyCode == 8;

        let shouldIgnore = 
          e.keyCode == 16 || // Shift
          e.keyCode == 27 || // ESC
          e.keyCode == 20 || // CAPS
          e.keyCode == 9  || // Tab
          e.keyCode == 17 ||// Ctr;
          e.keyCode == 18 || //Alt
          e.keyCode == 93 || // ContextMenu
          (e.keyCode > 111 && e.keyCode < 124)

        if(shouldIgnore) { return } 
        if((i == 0) && isBackspace) { return }
        if((i == inputs.length) && !isBackspace) { return }
        if(isBackspace) {
          inputs.get(i - 1).focus();
        } else {
          inputs.get(i + 1).focus();
        }

      });
    });
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
      displayBackendError(err);
      this.checkComplete = true;
    });
  }

  pairButtonClicked() {
    var inputs = $(".pairing-code-holder").children();
    var pairingCodeArray: String[] = [];
    inputs.each((i, item) => {
      pairingCodeArray.push($(item).val())
    });
    var pairingString = pairingCodeArray.join("")
    SpinnerUtil.showSpinner();

    this.walletService.getInfoFromPairingCode(pairingString).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      this.startWalletInit(res.address, res.public_key);
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

}

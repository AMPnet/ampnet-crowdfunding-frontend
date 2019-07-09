import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletService } from './wallet.service';
import swal from 'sweetalert2';
import { WalletModel } from '../models/WalletModel';
import { SpinnerUtil } from '../utilities/spinner-utilities';


declare var $:any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private walletService: WalletService) { }

  wallet: WalletModel;

  ngOnInit() {
    this.getUserWallet();
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
    this.walletService.getWallet().subscribe(res => {
      this.wallet = res;
    }, err => {

    });
  }

}

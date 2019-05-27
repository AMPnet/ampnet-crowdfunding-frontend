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

  @ViewChild("scanner") scanner;

  constructor(private walletService: WalletService) { }

  private walletModel: WalletModel;
  shouldShowScanner = false;

  ngOnInit() {
    // this.fetchWallet();
    $('#initWalletModal').on('hidden.bs.modal', this.modalClosed);
  }

  depositButtonClicked() {
  
  }

  // fetchWallet() {
  //   SpinnerUtil.showSpinner();
  //   this.walletService.getWallet().subscribe(res => {
  //     SpinnerUtil.hideSpinner();
  //     this.walletModel = res;
  //   }, err => {
  //     SpinnerUtil.hideSpinner();
  //    if(err.status != 404) {
  //      swal("", err.message, "warning");
  //    }
  //   })
  // }

  // walletIsInitialized(): boolean {
  //   return this.walletModel != null;
  // }

  // async scanSuccessHandler(event) {
  //   SpinnerUtil.showSpinner();
  //   $('#initWalletModal').modal('toggle');
    
  //   let eth = new EthereumProtocol();
  //   let syncProtocolUtils = new SyncProtocolUtils();

  //   let parsedResponse = (event).replace('airgap-wallet://?d=', '');
  //   let syncCode = await syncProtocolUtils.deserialize(parsedResponse);
  //   let payload = syncCode.payload as SyncWalletRequest;
  //   let pubkey = payload.publicKey;
  //   let address = eth.getAddressFromPublicKey(pubkey);

  //   this.initWallet(address, pubkey);
  // }

  // initWallet(address: string, publicKey: string) {  
  //   this.walletService.initWallet(address, publicKey).subscribe(res => {
  //     this.walletModel = res;
  //     SpinnerUtil.hideSpinner();
  //   }, err => {
  //     SpinnerUtil.hideSpinner();
  //     swal('', JSON.stringify(err), 'warning');
  //   });
  // }
  
  // camerasFoundHandler(event) {
  //   this.scanner.scan(event[0].deviceId);
  // } 

  // initializeWalletButtonClicked() {
  //   this.shouldShowScanner = true;
  // }

  modalClosed() {
    this.shouldShowScanner = false;
  }

}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Uppy from 'uppy'
import { ActivatedRoute } from '@angular/router';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { ManageWithdrawModel } from '../manage-withdraw-model';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import * as QRCode from 'qrcode'
import { WithdrawCooperativeService } from 'src/app/manage-withdrawals/withdraw.cooperative.service';
import { ArkaneConnect, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-single-withdrawal',
  templateUrl: './single-withdrawal.component.html',
  styleUrls: ['./single-withdrawal.component.css']
})
export class SingleWithdrawalComponent implements OnInit, AfterViewInit {

  withdrawal: ManageWithdrawModel

  constructor(private route: ActivatedRoute,
    private withdrawCooperativeService: WithdrawCooperativeService,
    private broadcastService: BroadcastService) { }

  ngOnInit() {
    this.getWithdrawal()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setUploadArea();
    }, 300)
  }

  getWithdrawal() {
    SpinnerUtil.showSpinner()
    let id = this.route.snapshot.params.ID;
    this.withdrawCooperativeService.getApprovedWithdrawals().subscribe((res:any) => {
      SpinnerUtil.hideSpinner()
      let withdraws: [ManageWithdrawModel] = res.withdraws;
      this.withdrawal = withdraws.filter(item => {
        return (item.id == id)
      })[0]
    }, hideSpinnerAndDisplayError)
  }

  approveAndGenerateCodeClicked() {
    SpinnerUtil.showSpinner()
    this.withdrawCooperativeService.generateBurnWithdrawTx(this.withdrawal.id).subscribe(async (res:any) => {
      
      let arkaneConnect = new ArkaneConnect('AMPnet', {
        environment: 'staging'
      })
      let account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY)

      let sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
        walletId: account.wallets[0].id,
        data: res.tx,
        type: SignatureRequestType.AETERNITY_RAW
      })
      this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
        .subscribe(res => {
          SpinnerUtil.hideSpinner()
          swal("", "Success", "success")
        }, hideSpinnerAndDisplayError)

    }, hideSpinnerAndDisplayError)
  }

  setUploadArea() {
    // let uppy = Uppy.Core({
    //   id: "payment-reciept",
    //   restrictions: {
    //     maxFileSize: null,
    //     maxNumberOfFiles: 1,
    //     minNumberOfFiles: 1,
    //     allowedFileTypes: null
    //   }
    // });
    // uppy.use(Uppy.Dashboard, {
    //   target: document.getElementById('payment-reciept-upload-target'),
    //   height: 300,
    //   width: $(".root-content-container").width(),
    //   inline: true,
    //   proudlyDisplayPoweredByUppy: false,
    //   note: "Upload the payment reciept for the withdrawal in PDF format"
    // })
  }

}

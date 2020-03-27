import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy'
import { ActivatedRoute } from '@angular/router';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { DepositModel, DepositCoreModel } from 'src/app/deposit/deposit-model';
import { prettyDate } from 'src/app/utilities/date-format-util';
import { API } from 'src/app/utilities/endpoint-manager';
import * as QRCode from 'qrcode'
import * as numeral from 'numeral'
import { DepositCooperativeService } from '../deposit.cooperative.service';
import { ArkaneConnect, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-manage-single-deposit',
  templateUrl: './manage-single-deposit.component.html',
  styleUrls: ['./manage-single-deposit.component.css']
})
export class ManageSingleDepositComponent implements OnInit {

  depositModel: DepositCoreModel

  constructor(private route: ActivatedRoute,
    private depositCooperativeService: DepositCooperativeService,
    private broadService: BroadcastService) { }

  paymentUppy: Uppy.Core.Uppy;

  ngOnInit() {

    this.getDeposit()


  }

  createUploadArea() {
    this.paymentUppy = Uppy.Core()

    this.paymentUppy.use(Uppy.Dashboard, {
      id: "reciept-payment",
      target: document.getElementById("payment-reciept-upload-target"),
      inline: true,
      height: 300,
      width: $(".root-content-container").width(),
      note: "Upload payment reciept for deposit",
      hideUploadButton: true
    })
  }

  generateSignerAndSign() {
    SpinnerUtil.showSpinner()

    this.depositCooperativeService.generateDepositMintTx(this.depositModel.deposit.id).subscribe(async (res: any) => {
      SpinnerUtil.hideSpinner()
      let arkaneConnect = new ArkaneConnect('Arketype', {
        environment: 'staging'
      })
    
      let account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY)
      let sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
        walletId: account.wallets[0].id,
        data: res.tx,
        type: SignatureRequestType.AETERNITY_RAW
      })
      this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
        .subscribe(res => {
          SpinnerUtil.hideSpinner()
          swal("", "Success", "success")
        }, hideSpinnerAndDisplayError)
    }, hideSpinnerAndDisplayError)
  }

  getDeposit() {
    let id = this.route.snapshot.params.ID
    SpinnerUtil.showSpinner()
    this.depositCooperativeService.getDeposit(id).subscribe((res: any) => {
      this.depositModel = res
      this.depositModel.deposit.created_at = prettyDate(res.created_at)
      this.depositModel.deposit.amount = numeral(this.depositModel.deposit.amount).format(",")
      if(!this.depositModel.deposit.approved) {
        setTimeout(() => { this.createUploadArea() }, 300)
      } else {
        this.generateSignerAndSign()
      }

      SpinnerUtil.hideSpinner()
    }, hideSpinnerAndDisplayError)
  }

  approveButtonClicked() {
    let depositAmount = $("#deposit-amount").val()

    let depositApprovalURL = this.depositCooperativeService.generateDepositApprovalURL(
      this.depositModel.deposit.id,
      depositAmount
    )

    console.log("PAYMENT UPPY: " + this.paymentUppy)
    this.paymentUppy.use(Uppy.XHRUpload, {
      endpoint: depositApprovalURL,
      fieldName: 'file',
      headers: {
        'Authorization': API.tokenHeaders().headers.Authorization
      }
    })

    SpinnerUtil.showSpinner()
    this.paymentUppy.upload().then(res => {
      SpinnerUtil.hideSpinner()
      this.getDeposit()
    })
  }

}

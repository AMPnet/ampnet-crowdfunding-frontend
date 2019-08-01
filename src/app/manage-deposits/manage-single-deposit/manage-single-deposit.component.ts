import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy'
import { ActivatedRoute } from '@angular/router';
import { DepositServiceService } from 'src/app/deposit/deposit-service.service';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { DepositModel } from 'src/app/deposit/deposit-model';
import { prettyDate } from 'src/app/utilities/date-format-util';
import { API } from 'src/app/utilities/endpoint-manager';
import { IssuingAuthorityService } from 'src/app/main-admin/issuing-authority.service';
import * as QRCode from 'qrcode'

declare var $: any;

@Component({
  selector: 'app-manage-single-deposit',
  templateUrl: './manage-single-deposit.component.html',
  styleUrls: ['./manage-single-deposit.component.css']
})
export class ManageSingleDepositComponent implements OnInit {

  depositModel: DepositModel

  constructor(private route: ActivatedRoute, 
    private depositService: DepositServiceService,
    private issuingAuthorityService: IssuingAuthorityService) { }

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

  generateSigningCode() {
    SpinnerUtil.showSpinner()
    this.issuingAuthorityService
      .mintTokens(this.depositModel.amount, this.depositModel.user.uuid).subscribe(res => {
        SpinnerUtil.hideSpinner()
        QRCode.toCanvas(document.getElementById("mint-deposit-code"), JSON.stringify(res), console.log)
      }, hideSpinnerAndDisplayError)
  }

  getDeposit() {
    let id = this.route.snapshot.params.ID
    SpinnerUtil.showSpinner()
    this.depositService.getDeposit(id).subscribe((res: any) => {
      this.depositModel = res
      this.depositModel.created_at = prettyDate(res.created_at)

      if(!this.depositModel.approved) {
        setTimeout(() => { this.createUploadArea() }, 300)
      } else {
        this.generateSigningCode()
      }

      SpinnerUtil.hideSpinner()
    }, hideSpinnerAndDisplayError)
  }

  approveButtonClicked() {
    let depositAmount = $("#deposit-amount").val()

    let depositApprovalURL = this.depositService.generateDepositApprovalURL(
      this.depositModel.id,
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

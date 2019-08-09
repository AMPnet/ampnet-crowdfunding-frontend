import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment-options/payment.service';
import { hideSpinnerAndDisplayError, displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { BankAccountModel } from '../payment-options/bank-account-model';
import { WithdrawService } from './withdraw.service';
import * as QRCode from 'qrcode'

declare var $: any;

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  activeBankAccount: number = 0
  banks: [BankAccountModel]

  pendingWithdrawal: WithdrawalModel

  constructor(private paymentService: PaymentService,
    private withdrawService: WithdrawService) { }

  ngOnInit() {
    this.getBankAccounts()
    this.getMyPendingWithdraw()
  }

  getBankAccounts() {
    SpinnerUtil.showSpinner()
    this.paymentService.getMyBankAccounts().subscribe((res: any) => {
      SpinnerUtil.hideSpinner()
      this.banks = res.bank_accounts;
    }, hideSpinnerAndDisplayError)
  }

  getMyPendingWithdraw() {
    SpinnerUtil.showSpinner()
    this.withdrawService.getMyPendingWithdraw().subscribe((res: any) => {
      this.pendingWithdrawal = res
      this.generateApproveQR(res.id)
    }, hideSpinnerAndDisplayError)
  }

  changeActiveAccount(index: number) {
    this.activeBankAccount = index
  }

  generateWithdrawClicked() {
    let amount = $("#withdraw-amount").val()
    
    SpinnerUtil.showSpinner()
    this.withdrawService
      .createWithdrawRequest(amount, this.banks[this.activeBankAccount].iban)
      .subscribe((res: any) => {
        this.generateApproveQR(res.id)
      }, hideSpinnerAndDisplayError)
  }

  generateApproveQR(id: number) {
    this.withdrawService.generateApproveWithdrawTx(id).subscribe(res =>{ 
      SpinnerUtil.hideSpinner()
      QRCode.toCanvas(document.getElementById("approve-data-canvas"),
        JSON.stringify(res),
        console.log)
    }, err => { 
      SpinnerUtil.hideSpinner()
      displayBackendError(err)
    })
  }

}

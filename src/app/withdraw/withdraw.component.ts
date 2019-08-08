import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment-options/payment.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { BankAccountModel } from '../payment-options/bank-account-model';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  activeBankAccount: number = 0
  banks: [BankAccountModel]

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.getBankAccounts()
  }

  getBankAccounts() {
    SpinnerUtil.showSpinner()
    this.paymentService.getMyBankAccounts().subscribe((res: any) => {
      SpinnerUtil.hideSpinner()
      this.banks = res.bank_accounts;
    }, hideSpinnerAndDisplayError)
  }

  changeActiveAccount(index: number) {
    this.activeBankAccount = index
  }

}

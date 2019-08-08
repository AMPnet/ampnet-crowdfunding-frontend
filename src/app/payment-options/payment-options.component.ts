import { Component, OnInit } from '@angular/core';
import { PaymentOptionModel, PaymentOptionType } from '../models/PaymentOptionModel';
import * as _ from 'lodash';
import { PaymentService } from './payment.service';
import { BankAccountModel } from './bank-account-model';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { Router } from '@angular/router';



@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.css']
})
export class PaymentOptionsComponent implements OnInit {

  banks: BankAccountModel[];

  constructor(private paymentService: PaymentService, 
    private router: Router) {
    
  }

  ngOnInit() {
    this.getBankAccounts()
  }

  getBankAccounts() {
    SpinnerUtil.showSpinner()
    this.paymentService.getMyBankAccounts().subscribe((res: any) => {
      SpinnerUtil.hideSpinner()
      if(res.bank_accounts.length == 0) {
        this.router.navigate(["dash", "payment_options", "new"], {
          queryParams: {
            "status": "empty"
          }
        })
      }
      this.banks = res.bank_accounts;
    }, hideSpinnerAndDisplayError)
  }

  deleteBankAccountClicked(id: number) {
    SpinnerUtil.showSpinner()
    this.paymentService.deleteBankAccount(id).subscribe(res => {
      this.getBankAccounts()
    }, hideSpinnerAndDisplayError)
  }

}

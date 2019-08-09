import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { hideSpinnerAndDisplayError, displayBackendError } from 'src/app/utilities/error-handler';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { BankCodeModel } from './bank-code-model';
import 'bootstrap-select'

declare var $: any

@Component({
  selector: 'app-new-payment-option',
  templateUrl: './new-payment-option.component.html',
  styleUrls: ['./new-payment-option.component.css']
})
export class NewPaymentOptionComponent implements OnInit {

  creditCardNavTab: JQuery;
  bankAccountNavTab: JQuery;

  hasNoBankAccounts: boolean
  
  bankCodes: [BankCodeModel]

  constructor(private paymentService: PaymentService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.checkStatusAndSetText()
    let file = require("../../../assets/hr-bic.json")
    this.bankCodes = file.list
    
    $(".bank-code-picker").selectpicker()
  }

  checkStatusAndSetText() {
    let status = this.route.snapshot.queryParams.status;
    this.hasNoBankAccounts = (status == "empty")
  }

  addNewBankAccountClicked() {
    let iban: string = (<string>$("#iban-holder").val())
    var bankCode: string = (<string>$("#bankcode-holder").val())
    if(bankCode.length == 0) {
      bankCode = "N/A"
    }
    SpinnerUtil.showSpinner()
    this.paymentService.createBankAccount(iban, bankCode).subscribe(res => {
      SpinnerUtil.hideSpinner()
      this.router.navigate(["dash", "payment_options"])
    }, err => {
      SpinnerUtil.hideSpinner()
      console.log(err)

      displayBackendError(err)
    })
  }

}

import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { PaymentService } from '../payment.service';
import { hideSpinnerAndDisplayError, displayBackendError } from 'src/app/utilities/error-handler';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';


@Component({
  selector: 'app-new-payment-option',
  templateUrl: './new-payment-option.component.html',
  styleUrls: ['./new-payment-option.component.css']
})
export class NewPaymentOptionComponent implements OnInit {

  creditCardNavTab: JQuery;
  bankAccountNavTab: JQuery;

  hasNoBankAccounts: boolean

  constructor(private paymentService: PaymentService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.checkStatusAndSetText()
  }

  checkStatusAndSetText() {
    let status = this.route.snapshot.queryParams.status;
    this.hasNoBankAccounts = (status == "empty")
  }

  addNewBankAccountClicked() {
    let iban: string = $("#iban-holder").val()
    var bankCode: string = $("#bankcode-holder").val()
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

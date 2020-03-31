import { Component, OnInit } from '@angular/core';
import { DepositServiceService } from './deposit-service.service';
import { hideSpinnerAndDisplayError, displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { DepositModel } from './deposit-model';
import Cleave from 'cleave.js'
import swal from 'sweetalert2';
import { autonumericCurrency, stripCurrencyData } from '../utilities/currency-util';

declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  depositModel: DepositModel;
  depositAmount: string;

  constructor(private depositService: DepositServiceService) { }

  ngOnInit() {
    // let cleave = new Cleave('.currency-input', {
    //   prefix: "€",
    //   delimiter: ".",
    //   numeralThousandsGroupStyle: 'thousand'
    // })
    $(document).ready(() => {
      autonumericCurrency("#deposit-amount")
    })
  }

  depositButtonClicked() {
    SpinnerUtil.showSpinner()
    this.depositService.createDeposit().subscribe((res: DepositModel) => {
      this.depositModel = res
      this.depositAmount = stripCurrencyData($("#deposit-amount").val())
      SpinnerUtil.hideSpinner()
    }, err => {
      SpinnerUtil.hideSpinner()
      console.log(err)
      if(err.error.err_code == "0509") {
        swal("", "You already have an existing deposit. Please wait until it's approved", "info")
      } else {
        displayBackendError(err)
      }
    })
  }

}

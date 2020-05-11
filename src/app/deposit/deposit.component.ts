import { Component, OnInit } from '@angular/core';
import { DepositServiceService } from './deposit-service.service';
import { hideSpinnerAndDisplayError, displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { DepositModel } from './deposit-model';
import swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  depositModel: DepositModel;
  masterIban: string;

  constructor(private depositService: DepositServiceService) { }

  ngOnInit() {
    SpinnerUtil.showSpinner();
    this.getMasterIban();
    this.depositService.getMyPendingDeposit().subscribe((res: DepositModel) => {
      this.depositModel = res;
    }, err => {
      SpinnerUtil.hideSpinner()
      if(err.status = 404) {
        this.generateDepositInfo()
      } else {
        displayBackendError(err)
      }
    })
  }

  generateDepositInfo() {
    SpinnerUtil.showSpinner()
    this.depositService.createDeposit().subscribe((res: DepositModel) => {
      this.depositModel = res
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

  getMasterIban() {
    this.depositService.getPlatformBankAccounts().subscribe((res: any) => {
      this.masterIban = res.bank_accounts[0].iban
    }, err => {
      hideSpinnerAndDisplayError(err)
    });
  }
}

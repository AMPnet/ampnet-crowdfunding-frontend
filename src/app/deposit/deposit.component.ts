import { Component, OnInit } from '@angular/core';
import { DepositServiceService } from './deposit-service.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { DepositModel } from './deposit-model';

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
  }

  depositButtonClicked() {
    SpinnerUtil.showSpinner()
    this.depositService.createDeposit().subscribe((res: DepositModel) => {
      this.depositModel = res
      this.depositAmount = $("#deposit-amount").val()
      SpinnerUtil.hideSpinner()
    }, hideSpinnerAndDisplayError)
  }

}

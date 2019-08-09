import { Component, OnInit } from '@angular/core';
import { WithdrawService } from '../withdraw/withdraw.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { ManageWithdrawModel } from './manage-withdraw-model';

@Component({
  selector: 'app-manage-withdrawals',
  templateUrl: './manage-withdrawals.component.html',
  styleUrls: ['./manage-withdrawals.component.css']
})
export class ManageWithdrawalsComponent implements OnInit {

  withdrawals: ManageWithdrawModel[]

  constructor(private withdrawService: WithdrawService) { 
  }

  ngOnInit() {
    this.getApprovedWithdrawals()
  }

  getApprovedWithdrawals() {
    SpinnerUtil.showSpinner()
    return this.withdrawService.getApprovedWithdrawals().subscribe((res: any) => {
      SpinnerUtil.hideSpinner()
      this.withdrawals = res.withdraws
    }, hideSpinnerAndDisplayError)
  }

}

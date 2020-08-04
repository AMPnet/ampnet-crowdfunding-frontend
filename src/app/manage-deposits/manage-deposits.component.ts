import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { DepositModel } from '../deposit/deposit-model';
import swal from 'sweetalert2';
import { DepositCooperativeService } from './deposit.cooperative.service';

declare var $: any;

@Component({
  selector: 'app-manage-deposits',
  templateUrl: './manage-deposits.component.html',
  styleUrls: ['./manage-deposits.component.css']
})
export class ManageDepositsComponent implements OnInit, AfterViewInit {

  unapprovedDeposits: [DepositModel]

  constructor(private router: Router, private depositCooperativeService: DepositCooperativeService) { }

  ngOnInit() {
    this.getUnapprovedDeposits()
  }

  ngAfterViewInit() {
  }

  getDepositInfoClicked() {
    let depositCode = $("#deposit-code-input").val();
    this.router.navigate(["/dash", "manage_deposits", depositCode])
  }

  getUnapprovedDeposits() {
    SpinnerUtil.showSpinner()
    this.depositCooperativeService.getUnapprovedDeposits().subscribe((res: any) => {
      this.unapprovedDeposits = res.deposits
      SpinnerUtil.hideSpinner()
    }, hideSpinnerAndDisplayError)
  }

  // TODO: cooperative can decline deposit, user can delete it, add comment!
  deleteDeposit(id: number) {
    let comment = "Some comment"
    SpinnerUtil.showSpinner()
    this.depositCooperativeService.declineDeposit(id, comment).subscribe(res => {
      this.getUnapprovedDeposits()
    }, hideSpinnerAndDisplayError)
  }

  contactPhoneClicked(index: number) {
    swal("Contact phone", "095 354 6106", "info")
  }

}

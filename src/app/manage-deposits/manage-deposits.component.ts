import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as QRCode from 'qrcode'
import { Router } from '@angular/router';
import { DepositServiceService } from '../deposit/deposit-service.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { DepositModel } from '../deposit/deposit-model';
import swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-manage-deposits',
  templateUrl: './manage-deposits.component.html',
  styleUrls: ['./manage-deposits.component.css']
})
export class ManageDepositsComponent implements OnInit, AfterViewInit {

  unapprovedDeposits: [DepositModel]

  constructor(private router: Router, private depositService: DepositServiceService) { }

  ngOnInit() {
    this.getUnapprovedDeposits()
  }

  ngAfterViewInit() {
    // let code = "asldkjaskldjalksdjalksjdklasjdklajsdlaksjdlkasjdlakjkalsjdalsjdlasjdlaskjdalksdjlakdjaldjaldjalskdjaldjalsdja"
    // QRCode.toCanvas(document.getElementById("minting-code-canvas"), code, 
    //   console.log)
  }

  getDepositInfoClicked() {
    let depositCode = $("#deposit-code-input").val();
    this.router.navigate(["/dash", "manage_deposits", depositCode])
  }

  getUnapprovedDeposits() {
    SpinnerUtil.showSpinner()
    this.depositService.getUnapprovedDeposits().subscribe((res: any) => {
      this.unapprovedDeposits = res.deposits
      SpinnerUtil.hideSpinner()
    }, hideSpinnerAndDisplayError)
  }

  deleteDeposit(id: number) {
    SpinnerUtil.showSpinner()
    this.depositService.deleteDeposit(id).subscribe(res => {
      this.getUnapprovedDeposits()
    }, hideSpinnerAndDisplayError)
  } 

  contactPhoneClicked(index: number) {
    swal("Contact phone", "095 354 6106", "info")
  }

}

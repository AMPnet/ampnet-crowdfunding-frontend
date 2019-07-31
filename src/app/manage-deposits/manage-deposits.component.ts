import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as QRCode from 'qrcode'
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-manage-deposits',
  templateUrl: './manage-deposits.component.html',
  styleUrls: ['./manage-deposits.component.css']
})
export class ManageDepositsComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }

  ngOnInit() {

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

}

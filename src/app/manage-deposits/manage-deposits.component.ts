import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as QRCode from 'qrcode'

@Component({
  selector: 'app-manage-deposits',
  templateUrl: './manage-deposits.component.html',
  styleUrls: ['./manage-deposits.component.css']
})
export class ManageDepositsComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let code = "asldkjaskldjalksdjalksjdklasjdklajsdlaksjdlkasjdlakjkalsjdalsjdlasjdlaskjdalksdjlakdjaldjaldjalskdjaldjalsdja"
    QRCode.toCanvas(document.getElementById("minting-code-canvas"), code, 
      console.log)
  }

}

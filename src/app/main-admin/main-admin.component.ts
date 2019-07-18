import { Component, OnInit } from '@angular/core';
import { IssuingAuthorityService } from './issuing-authority.service';
import { UserService } from '../user-utils/user-service';
import { displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import * as QRCode from 'qrcode';
declare var _: any;
declare var $: any;

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.css']
})
export class MainAdminComponent implements OnInit {

  constructor(private issuingAuthService: IssuingAuthorityService, private userService: UserService) { }

  userUUID = "";

  ngOnInit() {

    SpinnerUtil.showSpinner();
    this.userService.getOwnProfile().subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      this.userUUID = res.uuid;
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })

  }

  mintButtonClicked() {
    SpinnerUtil.showSpinner();
    this.issuingAuthService.mintTokens(10000, this.userUUID).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      QRCode.toCanvas(document.getElementById("mint-burn-sign-canvas"), JSON.stringify(res), console.log);
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

}

import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { UserService } from '../user-utils/user-service';
import { hideSpinnerAndDisplayError, displayBackendError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import { UserStatusStorage } from '../user-status-storage';
import { WalletService } from '../wallet/wallet.service';
import { WalletModel } from '../models/WalletModel';
import { PaymentService } from '../payment-options/payment.service';
import { PaymentModels } from '../models/payment-model'

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.css']
})
export class SecureLayoutComponent implements OnInit {


  userIsVerified = false;
  hasWalletActive = false;

  constructor(private userService: UserService, 
    private router: Router) { }

  ngOnInit() {
   
    
    this.router.events.subscribe(() => {
      this.userIsVerified = UserStatusStorage.personalData.verified;
      this.hasWalletActive = UserStatusStorage.walletData != undefined
    })

  }

}

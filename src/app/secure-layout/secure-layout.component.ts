import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-utils/user-service';
import { Router } from '@angular/router';
import { UserStatusStorage } from '../user-status-storage';

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
      this.hasWalletActive = UserStatusStorage.walletData != undefined;
    });

  }

}

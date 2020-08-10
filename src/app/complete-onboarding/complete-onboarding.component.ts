import { Component, OnInit } from '@angular/core';
import { UserStatusStorage } from '../user-status-storage';

@Component({
  selector: 'app-complete-onboarding',
  templateUrl: './complete-onboarding.component.html',
  styleUrls: ['./complete-onboarding.component.css']
})
export class CompleteOnboardingComponent implements OnInit {

  isVerified: boolean;
  hasWallet: boolean;

  constructor() { }

  ngOnInit() {
    this.isVerified = UserStatusStorage.personalData.verified;
    this.hasWallet = UserStatusStorage.walletData != undefined;
  }

}

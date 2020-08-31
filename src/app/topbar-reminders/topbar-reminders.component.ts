import { Component, OnInit } from '@angular/core';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Component({
  selector: 'app-topbar-reminders',
  templateUrl: './topbar-reminders.component.html',
  styleUrls: ['./topbar-reminders.component.css']
})
export class TopbarRemindersComponent implements OnInit {
  wallet: WalletDetails;
  isWalletInit = true;

  constructor(private walletService: WalletService) { }

  ngOnInit() {
    this.getUserWallet();
  }

  getUserWallet() {
    this.walletService.getUserWallet().subscribe(res => {
        this.wallet = res;
    });
}

}

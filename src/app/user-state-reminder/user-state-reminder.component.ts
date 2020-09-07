import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Component({
  selector: 'app-user-state-reminder',
  templateUrl: './user-state-reminder.component.html',
  styleUrls: ['./user-state-reminder.component.css']
})
export class UserStateReminderComponent implements OnInit, OnDestroy {
  isWalletInit = true;
  wallet: WalletDetails;
  walletChangeSub: Subscription;

  constructor(private walletService: WalletService) {
    this.walletService.getUserWallet().subscribe( (res: any) => {
        this.wallet = res;
    });
  }

  ngOnInit() {
      this.showErrorMessage();
  }

  showErrorMessage() {
    this.walletChangeSub = this.walletService.walletChange$.subscribe(res => {
        if (res !== null) {
            this.isWalletInit = true;
        } else {
            this.isWalletInit = false;
        }
      });
  }

  ngOnDestroy() {
      this.walletChangeSub.unsubscribe();
  }
}

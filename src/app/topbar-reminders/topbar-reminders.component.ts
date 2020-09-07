import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopbarService } from '../shared/services/topbar.service';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { throwIfEmpty } from 'rxjs/operators';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-topbar-reminders',
  templateUrl: './topbar-reminders.component.html',
  styleUrls: ['./topbar-reminders.component.css']
})
export class TopbarRemindersComponent implements OnInit, OnDestroy {
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

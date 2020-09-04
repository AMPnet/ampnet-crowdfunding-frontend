import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopbarService } from '../shared/services/topbar.service';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-topbar-reminders',
  templateUrl: './topbar-reminders.component.html',
  styleUrls: ['./topbar-reminders.component.css']
})
export class TopbarRemindersComponent implements OnInit, OnDestroy {
  isWalletInit = true;
  walletSub: Subscription;

  constructor(private walletService: WalletService) {
    /* this.walletSub = this.topbarService.getWalletState().subscribe(res => {
      this.isWalletInit = res;
    }); */
  }

  ngOnInit() {
      this.walletService.walletChange$.subscribe(res => {
          console.log(res);
      })
      /* this.walletService.walletChange$.subscribe(res => {
          console.log(res);
      }) */
  }

  ngOnDestroy() {
    /* this.walletSub.unsubscribe(); */
  }
}

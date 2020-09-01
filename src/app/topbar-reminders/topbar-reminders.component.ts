import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopbarService } from '../shared/services/topbar.service';

@Component({
  selector: 'app-topbar-reminders',
  templateUrl: './topbar-reminders.component.html',
  styleUrls: ['./topbar-reminders.component.css']
})
export class TopbarRemindersComponent implements OnInit, OnDestroy {
  isWalletInit = true;
  walletSub: Subscription;

  constructor(private topbarService: TopbarService) {
    this.walletSub = this.topbarService.getWalletState().subscribe(res => {
      this.isWalletInit = res;
      console.log(this.isWalletInit)
    })
    
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.walletSub.unsubscribe();
  }
}

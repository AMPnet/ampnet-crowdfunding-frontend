import { Injectable } from '@angular/core';
import { WalletService } from './wallet/wallet.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {
  private subject = new Subject<any>();

  constructor(private walletService: WalletService) {}

  getWalletState(): Observable<any> {
    this.walletService.getUserWallet().subscribe(res => {
      this.subject.next(true);
    }, err => {
      this.subject.next(false);
  });
    return this.subject.asObservable();
  }

  walletInInitProcess(isWalletInit: boolean) {
    this.subject.next(isWalletInit);
  }

}

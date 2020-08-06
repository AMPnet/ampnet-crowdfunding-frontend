import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { WalletModel } from '../models/WalletModel';
import { UserStatusStorage } from '../user-status-storage';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private endpoint = '/wallet/wallet';

  constructor(private http: HttpClient) {
  }

  initWallet(address: string) {
    return this.http.post<WalletModel>(API.generateRoute(this.endpoint), {
      'public_key': address
    }, API.tokenHeaders());
  }

  getWallet() {
    let walletResponse = this.http.get<WalletModel>(API.generateRoute(this.endpoint), API.tokenHeaders());
    walletResponse.subscribe((res: WalletModel) => {
      UserStatusStorage.walletData = res;

    });
    return walletResponse;
  }

  getInfoFromPairingCode(pairingCode: string) {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      'pair', pairingCode
    ]), API.tokenHeaders());
  }
}

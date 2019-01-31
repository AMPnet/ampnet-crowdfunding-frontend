import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { WalletModel } from '../models/WalletModel';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private endpoint = '/wallet'; 

  constructor(private http: HttpClient) { }

  initWallet(address: string) {
    return this.http.post<WalletModel>(API.generateRoute(this.endpoint), {
      "address" : address
    }, API.tokenHeaders());
  }

  getWallet() {
    return this.http.get<WalletModel>(API.generateRoute(this.endpoint), API.tokenHeaders());
  }
}

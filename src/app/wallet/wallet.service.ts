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

  initWallet() {
    return this.http.post<WalletModel>(API.generateRoute(this.endpoint), {
      "address" : "0xa23D6C59369c0F1fCbb39c171A3b9cBE92A201c5"
    }, API.tokenHeaders());
  }

  getWallet() {
    return this.http.get<WalletModel>(API.generateRoute(this.endpoint), API.tokenHeaders());
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class OwnershipService {

  ownershipEndpoint = '/wallet/cooperative/wallet/transfer/transaction';

  constructor(private http: HttpClient) { }


  getPlatformManagerTransaction(walletAddress: string) {
    return this.getOwnershipChangeTransaction(walletAddress, 'PLATFORM_MANAGER');
  }

  getTokenIssuerTransaction(walletAddress: string) {
      return this.getOwnershipChangeTransaction(walletAddress, 'TOKEN_ISSUER');
  }

  private getOwnershipChangeTransaction(walletAddress: string, type: string) {
    return this.http.post(API.generateRoute(this.ownershipEndpoint), {
        'wallet_address': walletAddress,
        'type': type
    });
  }


}


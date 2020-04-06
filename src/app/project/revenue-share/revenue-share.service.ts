import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class RevenueShareService {

  private walletEndpoint = "/wallet/public/wallet/project"
  private revenueShareEndpoint = "/wallet/revenue/payout/project"

  constructor(private http: HttpClient) { }

  getProjectWallet(projectID: number) {
    return this.http.get(API.generateComplexRoute(this.walletEndpoint, [
      projectID.toString()
    ]), API.tokenHeaders());
  }

  generateRevenueShareTx(projectID: string, amount: number) {
    return this.http.post(API.generateComplexRoute(this.revenueShareEndpoint, [projectID]), {
      "amount": amount.toString()
    }, API.tokenHeaders())
  }

}

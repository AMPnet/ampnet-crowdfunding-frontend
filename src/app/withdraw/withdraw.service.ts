import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {

  endpoint = "/api/v1/withdraw"

  constructor(private http: HttpClient) { }

  createWithdrawRequest(amount: number, iban: string) {
    return this.http.post(API.generateRoute(this.endpoint), {
      "amount": amount.toString(),
      "bank_account": iban
    }, API.tokenHeaders())
  }

  generateApproveWithdrawTx(withdrawID: number) {
    return this.http.post(API.generateComplexRoute(this.endpoint, [
      withdrawID.toString(), "transaction", "approve"
    ]), {}, API.tokenHeaders())
  }

  generateBurnWithdrawTx(withdrawID: number) {
    return this.http.post(API.generateComplexRoute(this.endpoint, [
      withdrawID.toString(), "transaction", "burn"
    ]), {}, API.tokenHeaders())
  }

  getMyPendingWithdraw() {
    return this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders())
  }

  getApprovedWithdrawals() {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      "approved"
    ]), API.tokenHeaders())
  }

  getBurnedWithdrawals() {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      "burned"
    ]), API.tokenHeaders())
  }

}
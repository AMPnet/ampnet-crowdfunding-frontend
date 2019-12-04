import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class DepositServiceService {

  private endpoint = "/wallet/deposit"

  constructor(private http: HttpClient) { }

  public createDeposit() {
    return this.http.post(API.generateRoute(this.endpoint), { }, API.tokenHeaders())
  }

  public getDeposit(reference: string) {
    return this.http.get(API.generateComplexRoute(this.endpoint, ["search"]), {
      params: {
        "reference": reference
      },
      headers: API.tokenHeaders().headers
    })
  }

  public generateDepositApprovalURL(id: number, amount: number): string {
    return API.generateComplexRoute(this.endpoint, [
      id.toString(), "approve?amount=" + amount.toString()
    ])
  }

  public getUnapprovedDeposits() {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      "unapproved"
    ]), API.tokenHeaders())
  }

  public deleteDeposit(id: number) {
    return this.http.delete(API.generateComplexRoute(this.endpoint,[
      id.toString()
    ]), API.tokenHeaders())
  }

  generateDepositMintTx(id: number) {
    return this.http.post(API.generateComplexRoute(this.endpoint, [
      id.toString(), "transaction"
    ]), {}, API.tokenHeaders())
  }
}

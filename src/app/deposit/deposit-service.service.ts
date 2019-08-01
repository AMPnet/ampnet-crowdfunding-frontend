import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class DepositServiceService {

  private endpoint = "/api/v1/deposit"

  constructor(private http: HttpClient) { }

  public createDeposit() {
    return this.http.post(API.generateRoute(this.endpoint), { }, API.tokenHeaders())
  }

  public getDeposit(reference: string) {
    return this.http.get(API.generateRoute(this.endpoint), {
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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  endpoint = "/user_api/bank-account"

  constructor(private http: HttpClient) { }

  getMyBankAccounts() {
    return this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders())
  }

  createBankAccount(iban: String, bankCode: String) {
    return this.http.post(API.generateRoute(this.endpoint), {
      "iban": iban,
      "bank_code": bankCode
    }, API.tokenHeaders())
  }

  deleteBankAccount(id: number) {
    return this.http.delete(API.generateComplexRoute(this.endpoint, [
      id.toString()
    ]), API.tokenHeaders())
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { PaymentModels } from '../models/payment-model';
import { UserStatusStorage } from '../user-status-storage';

@Injectable({
  providedIn: 'root'
})
export class PlatformBankAccountService {

  endpoint = "/wallet/bank-account"

  constructor(private http: HttpClient) { }

  getMyBankAccounts() {
    return this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders())
  }

  createBankAccount(iban: String, bankCode: String, alias: String) {
    return this.http.post(API.generateRoute(this.endpoint), {
      "iban": iban,
      "bank_code": bankCode,
      "alias": alias
    }, API.tokenHeaders())
  }

  deleteBankAccount(id: number) {
    return this.http.delete(API.generateComplexRoute(this.endpoint, [
      id.toString()
    ]), API.tokenHeaders())
  }
}

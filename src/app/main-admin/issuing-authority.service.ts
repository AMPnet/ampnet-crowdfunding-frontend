import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class IssuingAuthorityService {

  issuerAddress = "0xC2500930248218f80187f07630A155F675c93930";
  endpoint = "/issuer"
  
  constructor(private http: HttpClient) { }

  mintTokens(amount: number, userUUID: string) {
    return this.tokenIssuingCall(amount, userUUID, "mint");
  }

  burnTokens(amount: number, userUUID: string) {
    return this.tokenIssuingCall(amount, userUUID, "burn");
  }

  private tokenIssuingCall(amount: number, userUUID: string, type: string) {
    return this.http.get(API.generateComplexRoute(this.endpoint, [type]), {
      params: {
        "amount": amount.toString(),
        "uuid": userUUID,
        "from": this.issuerAddress
      }, headers: {
        "Authorization": API.tokenHeaders().headers["Authorization"]
      }
    });
  }
}

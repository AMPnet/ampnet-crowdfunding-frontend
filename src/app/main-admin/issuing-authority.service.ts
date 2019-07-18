import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class IssuingAuthorityService {

  issuerAddress = "";
  endpoint = "/issuer"
  
  constructor(private http: HttpClient) { }

  mintTokens(amount: number, userUUID: string) {
    this.tokenIssuingCall(amount, userUUID, "mint");
  }

  burnTokens(amount: number, userUUID: string) {
    this.tokenIssuingCall(amount, userUUID, "burn");
  }

  private tokenIssuingCall(amount: number, userUUID: string, type: string) {
    this.http.get(API.generateComplexRoute(this.endpoint, [type]), {
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

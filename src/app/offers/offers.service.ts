import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  projectEndpoint = "/wallet/public/project";
  privateEndpoint = "/project"

  constructor(private http: HttpClient) { }

  getAllOffers() {
    return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
      "active"
    ]));
  }

  getOfferByID(offerID: number) {
    return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
      offerID.toString()
    ]));
  }

  generateTransactionToGreenvest(projectID: string, investAmount: number) {

    return this.http.get(API.generateComplexRoute(this.privateEndpoint, [
      projectID.toString(), "invest"
    ]), {
      params: {
        "amount": investAmount.toString()
      },
      headers: {
        "Authorization" : API.tokenHeaders().headers.Authorization
      }
    });

  }

  generateTransactionToConfirmGreenvest(projectID: number) {
    return this.http.get(API.generateComplexRoute(this.privateEndpoint, [
      projectID.toString(), "invest", "confirm"
    ]), API.tokenHeaders())
  }
}

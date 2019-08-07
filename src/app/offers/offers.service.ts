import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  projectEndpoint = "/public/project";

  constructor(private http: HttpClient) { }

  getAllOffers() {
    return this.http.get(API.generateRoute(this.projectEndpoint), 
      API.tokenHeaders());
  }

  getOfferByID(offerID: number) {
    return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
      offerID.toString()
    ]), API.tokenHeaders());
  }

  generateTransactionToGreenvest(projectID: number, investAmount: number) {

    return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
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
    return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
      projectID.toString(), "invest", "confirm"
    ]), API.tokenHeaders())
  }
}

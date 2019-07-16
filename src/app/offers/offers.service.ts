import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  projectEndpoint = "/project";

  constructor(private http: HttpClient) { }

  getAllOffers() {
    return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
      "organization/6"
    ]), API.tokenHeaders());
  }

}

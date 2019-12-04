import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

     endpoint = "/wallet/portfolio"

    constructor(private http: HttpClient) { }

    getInvestments() {
        return this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders())
    }

}

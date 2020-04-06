import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

     endpoint = "/wallet/portfolio"

    constructor(private http: HttpClient) { }

    getPortfolioStats() {
      return this.http.get(API.generateComplexRoute(this.endpoint, ["stats"]), API.tokenHeaders())
    }

    getPortfolio() {
      return this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders())
    }

    getInvestmentsInProject(projectID: string) {
      return this.http.get(API.generateComplexRoute(this.endpoint, [
        "project", projectID
      ]), API.tokenHeaders())
    }

}

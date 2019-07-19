import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class RevenueShareService {

  private walletEndpoint = "/wallet/project"

  constructor(private http: HttpClient) { }

  getProjectWallet(projectID: number) {
    return this.http.get(API.generateComplexRoute(this.walletEndpoint, [
      projectID.toString()
    ]), API.tokenHeaders());
  }

}

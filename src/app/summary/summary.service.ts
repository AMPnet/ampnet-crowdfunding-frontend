import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { retry } from 'rxjs/operators';

@Injectable({
  'providedIn': 'root'
})
export class SummaryService {

  constructor(private http: HttpClient) {
  }

  // registered: number
  getUsers() {
    return this.http.get(API.generateComplexRoute('/user/public', ['user', 'count']))
      .pipe(
        retry(3) // retry a failed request up to 3 times
        // catchError(this.handleError) // then handle the error
      );
  }

  // active_projects: number
  getNumberOfActiveProjects() {
    return this.http.get(API.generateComplexRoute('/public/project', ['active', 'count']))
      .pipe(retry(3));
  }

  // BlockchainSummary
  getBlockchainMiddlewareData() {
    return this.http.get(API.generateComplexRoute('/middleware', ['summary']))
      .pipe(retry(3));
  }
}

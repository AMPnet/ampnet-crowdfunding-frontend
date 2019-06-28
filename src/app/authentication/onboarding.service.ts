import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  endpoint: string = "/user_api/identyum/token";

  constructor(private http: HttpClient) { }

  getSessionID() {
    return this.http.get(API.generateRoute(this.endpoint));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  endpoint: string = "/user/identyum/token";
  verifyEndpoint: string = "/me/verify";

  constructor(private http: HttpClient) { }

  getSessionID() {
    return this.http.get(API.generateRoute(this.endpoint));
  }

  verifyUser(webSessionUUID: string) {
    return this.http.post(API.generateRoute(this.verifyEndpoint), {
      "web_session_uuid": webSessionUUID
    }, API.tokenHeaders())
  }
}

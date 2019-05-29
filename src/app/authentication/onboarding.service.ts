import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private http: HttpClient) { }

  getSessionID() {
    return this.http.post("https://webid.identyum.com/api/webid/generateToken", {
      "username": "ampnet",
      "password" : "#ampnet$"
    });
  }
}

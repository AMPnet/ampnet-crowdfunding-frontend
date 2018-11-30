import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private endpoint = "/signup";

  constructor(private http: HttpClient) { }

  performEmailSignup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    countryId: number,
    phoneNumber: string
  ) {
    return this.http.post(API.generateRoute(this.endpoint) , {
      'signup_method': 'EMAIL',
      'user_info' : {
        'email' : email,
        'password' : password,
        'first_name' : firstName,
        'last_name' : lastName,
        'country_id' : countryId,
        'phone_number': phoneNumber
      }
    });
  }
}

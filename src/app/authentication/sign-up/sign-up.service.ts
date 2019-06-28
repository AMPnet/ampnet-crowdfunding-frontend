import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/utilities/endpoint-manager';
import { CheckEmailModel } from 'src/app/models/auth/check-email-model';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private endpoint = "/user_api/signup";
  private checkEmailEndpoint = "/user_api/mail-check";

  constructor(
    private http: HttpClient) { }

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

  performSocialSignup(provider: string, authToken: string, webSessionUUID: string) {
    return this.http.post(API.generateRoute(this.endpoint), {
      "web_session_uuid": webSessionUUID,
      "signup_method": provider,
      "user_info" : {
        "token" : authToken
      }
    });
  }

  checkEmail(email: string, onComplete: (userExists: boolean) => void) {
    return this.http.post(API.generateRoute(this.checkEmailEndpoint), {
      "email" : email
    }).subscribe((res: any) => {
      onComplete(res.userExists);
    }, err => {
      // TODO: Handle error
    })
  }
}

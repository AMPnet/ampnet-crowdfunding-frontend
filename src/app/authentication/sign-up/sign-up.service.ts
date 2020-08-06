import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/utilities/endpoint-manager';
import { CheckEmailModel } from 'src/app/models/auth/check-email-model';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private endpoint = '/user/signup';
  private checkEmailEndpoint = '/user/mail-check';

  constructor(
    private http: HttpClient) { }

  performEmailSignup(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) {
    return this.http.post(API.generateRoute(this.endpoint) , {
      'signup_method': 'EMAIL',
      'user_info': {
        'first_name': firstName,
        'last_name': lastName,
        'email': email,
        'password': password
      }
    });
  }

  performSocialSignup(provider: string, authToken: string) {
    return this.http.post(API.generateRoute(this.endpoint), {
      'signup_method': provider,
      'user_info' : {
        'token' : authToken
      }
    });
  }

  checkEmail(email: string, onComplete: (userExists: boolean) => void) {
    return this.http.post(API.generateRoute(this.checkEmailEndpoint), {
      'email' : email
    }).subscribe((res: any) => {
      onComplete(res.userExists);
    }, err => {
      // TODO: Handle error
    });
  }
}

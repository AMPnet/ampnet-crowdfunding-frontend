import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/utilities/endpoint-manager';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private endpoint = "/signup";


  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

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

  performGoogleSignup(authToken: string) {
    return this.http.post(API.generateRoute(this.endpoint), {
      "signup_method": "GOOGLE",
      "user_info" : {
        "token" : authToken
      }
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  checkSocialLogin(onComplete: (user: SocialUser) => void) {
    this.authService.authState.subscribe((user) => {
      onComplete(user);
    });
  }
}

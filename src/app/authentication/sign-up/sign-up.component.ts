import { Component, OnInit, Injectable, Input } from '@angular/core';

import * as $ from 'jquery';
import { CountryService } from 'src/app/countries/country.service';
import { CountryModel } from 'src/app/models/countries/CountryModel';
import { SignUpService } from './sign-up.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Form, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { SocialUser, GoogleLoginProvider, AuthService, FacebookLoginProvider } from 'angularx-social-login';
import { EmailSignupModel } from 'src/app/models/auth/EmailSignupModel';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { LogInModalService } from '../log-in-modal/log-in-modal.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  emailSignupForm: FormGroup;

  constructor(
    private signUpService: SignUpService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private loginService: LogInModalService,
    private formBuilder: FormBuilder
  ) {
    this.emailSignupForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      email: ''
    })
  }

  countries: CountryModel[];

  ngOnInit() {
  }

  getCountries() {
  
  }

  performGoogleSignup() {
    this.performSocialSignup(GoogleLoginProvider.PROVIDER_ID);
  }

  performFacebookSignup() {
    this.performSocialSignup(FacebookLoginProvider.PROVIDER_ID);
  }

  performSocialSignup(provider: string) {
    SpinnerUtil.showSpinner();

    let that = this;
    let afterSignout: () => void = function() {
      that.authService.signIn(provider).then(res => {

        that.signUpService.performSocialSignup(res.provider, 
          res.authToken).subscribe(usr => {

          SpinnerUtil.hideSpinner();
          usr["auth"] = res.authToken;
          usr['provider'] = res.provider;
         
          that.loginService.performSocialLogin(GoogleLoginProvider.PROVIDER_ID, res.authToken)
            .subscribe(res => {
              localStorage.setItem('access_token', (<any>res).access_token);
              that.router.navigate(["/dash"])
            }, displayBackendError)


        }, err => {

          SpinnerUtil.hideSpinner();
          swal("", err.error.message, "warning");

        });
      }).catch(err => {

        SpinnerUtil.hideSpinner();
        swal("", err, "warning");

      })
    }
    afterSignout();
  }

  onSubmitEmailForm(formData) {
    SpinnerUtil.showSpinner();
    let values = this.emailSignupForm.value;
    this.signUpService.performEmailSignup(
      values.email,
      values.firstName,
      values.lastName,
      values.password
    ).subscribe((res: any) => {
      swal("", "A confirmation mail has been sent to " + res.email, "success")
      
      SpinnerUtil.hideSpinner();
    }, hideSpinnerAndDisplayError)
  }

  

  displayLoggedInMessage() {
    swal("Logged In!", `You are already logged in with your Google Account.
    Please go to the login screen and proceed there`, "info");
  }

}

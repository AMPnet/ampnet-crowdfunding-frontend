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

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {


  submissionForm: FormGroup;
  
  uuidParam: string;

  constructor(
    private signUpService: SignUpService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { 
  }

  countries: CountryModel[];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.uuidParam = params['web_uuid'];
    });
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

        alert(that.uuidParam);
        that.signUpService.performSocialSignup(res.provider, res.authToken, that.uuidParam).subscribe(usr => {

          SpinnerUtil.hideSpinner();
          usr["auth"] = res.authToken;
          usr['provider'] = res.provider;
          that.router.navigate(['/dash']);

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

  

  displayLoggedInMessage() {
    swal("Logged In!", `You are already logged in with your Google Account.
    Please go to the login screen and proceed there`, "info");
  }

}

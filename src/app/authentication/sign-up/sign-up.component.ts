import { Component, OnInit, Injectable, Input } from '@angular/core';

import * as $ from 'jquery';
import { CountryService } from 'src/app/countries/country.service';
import { CountryModel } from 'src/app/models/countries/CountryModel';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
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
  


  constructor(
    private countryService: CountryService,
    private signUpService: SignUpService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { 
  }

  countries: CountryModel[];

  ngOnInit() {
    let countryModel = new CountryModel();
    this.countries = [
      countryModel
    ];
    this.getCountries();

  }

  getCountries() {
    this.countryService.getCountries()
      .subscribe(countries => {
        this.countries = countries.countries;
      });

      let nameValidators = [Validators.minLength(1), Validators.maxLength(30)];

      this.submissionForm = this.fb.group({
        firstName: ['', nameValidators],
        lastName: ['', nameValidators],
        email: ['', [Validators.email]],
        phoneNumber: ['', [Validators.minLength(4)]],
        password: ['', [Validators.minLength(8)]],
        confirmPassword: ['', [Validators.minLength(8)]],
        country: ['', Validators.required],
        tosCheck: ['', [Validators.required]]
      });

      this.submissionForm.controls['email'].valueChanges.subscribe(val => {
        
      });

      this.submissionForm.controls['confirmPassword'].valueChanges.subscribe(val => {
        let controls = this.submissionForm.controls;
        if (controls['password'] !== controls['confirmPassword']) {
          
        }
      });
  }

  onSubmitClicked() {

    let controls = this.submissionForm.controls;

    this.signUpService.performEmailSignup(
      controls['email'].value,
      controls['password'].value,
      controls['firstName'].value,
      controls['lastName'].value,
      controls['country'].value,
      controls['phoneNumber'].value
    ).subscribe(_ => {
      this.handleSuccess();
    }, err => {
      swal({
        title: 'Error',
        text: err.error.description,
        type: 'error',
        confirmButtonText: 'Cancel'
      });
    })

  }

  private handleSuccess() {

    this.router.navigate(['confirm_email'], {
      queryParams: {
        email: this.submissionForm.controls['email'].value
      }
    })
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
        that.signUpService.performSocialSignup(res.provider, res.authToken).subscribe(usr => {
          SpinnerUtil.hideSpinner();
          usr["auth"] = res.authToken;
          usr['provider'] = res.provider;
          that.router.navigate(['/fill_data'], {
            queryParams: usr
          });
        }, err => {
          SpinnerUtil.hideSpinner();
          swal("", err.error.message, "warning");
        });
      }).catch(err => {
        SpinnerUtil.hideSpinner();
        swal("", err, "warning");
      })
    }
    
    this.authService.signOut().then(_ => {
      afterSignout();
    }).catch(_ => {
      afterSignout();
    })
  }

  

  displayLoggedInMessage() {
    swal("Logged In!", `You are already logged in with your Google Account.
    Please go to the login screen and proceed there`, "info");
  }

}

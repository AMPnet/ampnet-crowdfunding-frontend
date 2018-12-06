import { Component, OnInit, Injectable, Input } from '@angular/core';

import * as $ from 'jquery';
import { CountryService } from 'src/app/countries/country.service';
import { CountryModel } from 'src/app/models/countries/CountryModel';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
import { ErrorModel } from 'src/app/models/ErrorModel';

import swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {


  firstName: string = "";
  lastName: string = "";
  phoneNumber: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  selectedCountry: number = 0;  

  constructor(
    private countryService: CountryService,
    private signUpService: SignUpService,
    private router: Router
  ) { }

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
  }

  onSubmitClicked() {

    // if(!this.handleInvalidInputs()) {
    //   return;
    // }
    

    this.signUpService.performEmailSignup(
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.selectedCountry,
      this.phoneNumber,
      () => {
        
      }, this.handleError);

  }

  private handleError(errorModel: ErrorModel) {
    swal({
      title: 'Error',
      text: errorModel.description,
      type: 'error',
      confirmButtonText: 'Close'
    });
  }

  private handleSuccess() {
    this.router.navigate(['confirm_email'], {
      queryParams: {
        email: this.email
      }
    })
  }

  private handleInvalidInputs(): boolean {

    return this.checkEmail(this.email) && this.checkPassword(this.password, this.confirmPassword);
  }

  private checkEmail(email: string): boolean {
    let matcher = new RegExp('.+\@.+\..+');
    return matcher.test(email);
  }

  private checkPassword(pass: string, passConfirm: string): boolean {
    if(pass.length < 8) return false;
    if(pass != passConfirm) return false;
    return true;
  }

}

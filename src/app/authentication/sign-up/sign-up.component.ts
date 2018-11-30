import { Component, OnInit, Injectable } from '@angular/core';

import * as $ from 'jquery';
import { CountryService } from 'src/app/countries/country.service';
import { CountryModel } from 'src/app/models/countries/CountryModel';
import { SignUpService } from './sign-up.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(
    private countryService: CountryService,
    private signUpService: SignUpService
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

    let email = $('#email-input');
    let password = $('#password-input');
    let passConfirm = $('#password-confirm-input'); 
    let phoneNumber = $('#phone-input');
    let country = $('#country-selector');
    let selectedCountry = country.find(':selected');

    if(!this.checkEmail(<string>email.val()) ||
      !this.checkPassword(<string>password.val(), <string>passConfirm.val())) {
        return;
    }

    this.signUpService.performEmailSignup(
      <string>email.val(),
      <string>password.val(),
      'Mislav',
      "Javor",
      parseInt(selectedCountry.attr('value')) - 1,
      "04949398934"
    ).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
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

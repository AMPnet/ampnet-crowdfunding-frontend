import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryService } from 'src/app/countries/country.service';
import { CountriesModel, CountryModel } from 'src/app/models/countries/CountryModel';
import swal from 'sweetalert2';
import { FillDataService } from './fill-data.service';
import { allSettled } from 'q';
import { LogInModalService } from '../../log-in-modal/log-in-modal.service';

@Component({
  selector: 'app-fill-data',
  templateUrl: './fill-data.component.html',
  styleUrls: ['./fill-data.component.css']
})
export class FillDataComponent implements OnInit {

  submissionForm: FormGroup;

  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  authToken: string;

  countries: CountryModel[];
  provider: string;

  constructor(private route: ActivatedRoute,
    private countryService: CountryService,
    private fb: FormBuilder,
    private fillDataService: FillDataService,
    private loginService: LogInModalService,
    private router: Router) { 



    
  }

  ngOnInit() {
    let nameValidators = [Validators.minLength(1), Validators.maxLength(30)];

    this.submissionForm = this.fb.group({
      firstName: ['', nameValidators],
      lastName: ['', nameValidators],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.minLength(4)]],
      country: ['', Validators.required],
      tosCheck: ['', [Validators.required]]
    });

    this.route.queryParams
      .subscribe(params => {
        this.email = params['email'];
        this.firstName = params['first_name'];
        this.lastName = params['last_name'];
        this.authToken = params['auth'];
        this.provider = params['provider'];

        let controls = this.submissionForm.controls;
        controls['firstName'].setValue(this.firstName);
        controls['lastName'].setValue(this.lastName);
        controls['email'].setValue(this.email);
        controls['phoneNumber'].setValue(this.phoneNumber);
      });
    this.countries = [
      new CountryModel()
    ];

    this.getCountries();
  }

  getCountries() {
    this.countryService.getCountries().subscribe(res => {
      this.countries = res.countries;
    }, err => {
      swal('', 'Error fetching countries', 'warning');
    });
  }

  submitButtonClicked() {
    this.logIn(() => {
      this.updateUserData();
    });
  }

  logIn(onComplete: () => void) {
    this.loginService.performSocialLogin(this.provider, this.authToken).subscribe(res => {
      localStorage.setItem('access_token', (<any>res).token);
      onComplete();
    }, err => {
      swal('', err.error.message, 'warning');
    })
  }

  updateUserData() {
    let controls = this.submissionForm.controls;
    this.fillDataService.updateUserData(
      controls['email'].value,
      controls['firstName'].value,
      controls['lastName'].value,
      controls['country'].value,
      controls['phoneNumber'].value
    ).subscribe(res => {
      swal('Success', `You've successfully signed up!`, 'success').then(res => {
        this.router.navigate(['dash']);
      });
    }, err => {
      swal('', err.error.message, 'warning');
    });
  }

}

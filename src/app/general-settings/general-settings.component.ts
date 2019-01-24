import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-utils/user-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import swal from 'sweetalert2';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {

  updateUserForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder) { 
      this.updateUserForm = fb.group({
        firstName: ['', Validators.minLength(1)],
        lastName: ['', Validators.minLength(1)],
        phoneNumber: ['', Validators.minLength(5)],
        idNumber: ['', Validators.minLength(5)]
      });
  }

  ngOnInit() {
    this.fillUserData();
  }

  fillUserData() {
    let controls = this.updateUserForm.controls;
    SpinnerUtil.showSpinner()
    this.userService.getOwnProfile().subscribe(res => {
      SpinnerUtil.hideSpinner();
      controls['firstName'].setValue(res['first_name']);
      controls['lastName'].setValue(res['last_name']);
      controls['phoneNumber'].setValue(res['phone_number']);
    }, err => {
      SpinnerUtil.hideSpinner();
      swal('', err.error.message, 'warning');
    });
  }

}

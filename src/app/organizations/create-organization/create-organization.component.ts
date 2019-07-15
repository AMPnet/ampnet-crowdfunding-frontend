import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../organization-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css']
})
export class CreateOrganizationComponent implements OnInit {

  newOrganizationForm: FormGroup;

  constructor(
    private organizationService: OrganizationService,
    private fb: FormBuilder,
    private router: Router) {

    this.newOrganizationForm = fb.group({
      name: ['', Validators.minLength(3)],
      type: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  submitButtonClicked() {
    SpinnerUtil.showSpinner();
    let controls = this.newOrganizationForm.controls;
    this.organizationService.createOrganization(controls['name'].value, controls['type'].value)
      .subscribe((res: any) => {
        SpinnerUtil.hideSpinner();
        swal('', 'Successfully created a new organization', 'success');
        this.router.navigate(['/dash', 'manage_groups', res.id]);
      }, err => {
        SpinnerUtil.hideSpinner();
        swal('', err.error.message, 'warning').then(() => {
          this.router.navigate(['/dash','manage_groups']);
        }, () => {
          this.router.navigate(['/dash','manage_groups']);
        });
      })
  }

}

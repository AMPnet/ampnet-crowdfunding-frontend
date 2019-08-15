import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ProjectService } from '../project-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { autonumericCurrency } from 'src/app/utilities/currency-util';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit, AfterViewInit {

  @ViewChild("date-picker")
  public datePickerElement: ElementRef;

  createProjectForm: FormGroup;

  constructor(private projectService: ProjectService, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private router: Router) { 
    this.createProjectForm = this.fb.group({
      'name': [' ', Validators.required],
      'description': [' ', Validators.required],
      'location': [' ', Validators.required],
      'colloqual': [' ', Validators.required],
      'startDate': [' ', Validators.required],
      'endDate': [' ', Validators.required],
      'expectedFunding': [' ', Validators.required],
      'minPerUser': [' ', Validators.required],
      'maxPerUser': [' ', Validators.required]
    });
  }

  submitForm() {
    if(!this.createProjectForm.valid) { return }
    var formValue = this.createProjectForm.value;
    let date = moment(formValue.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    formValue.startDate = date;
    formValue.endDate = moment(formValue.endDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    formValue.location = "abc";
    let orgID = this.activatedRoute.snapshot.params.orgId;

    SpinnerUtil.showSpinner();

    alert("Org ID: " + orgID);
    this.projectService.createProject(
      orgID,
      formValue.name,
      formValue.description,
      "abc",
      formValue.colloqual,
      "10",
      formValue.startDate,
      formValue.endDate,
      formValue.expectedFunding,
      "EUR",
      formValue.minPerUser,
      formValue.maxPerUser,
      false
    ).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      this.router.navigate(['/dash', 'manage_groups', orgID.toString(), 'manage_project', res.id]);
    }, err => {
      console.log(err);
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

  ngOnInit() {

    
    
  }

  ngAfterViewInit() {
    flatpickr(this.datePickerElement.nativeElement , {});
    
    setTimeout(() => {
      autonumericCurrency("#min-per-user-input")
      autonumericCurrency("#max-per-user-input")
      autonumericCurrency("#expected-funding-input")
    }, 200)
    
  }

  submitButtonClicked() { }

}

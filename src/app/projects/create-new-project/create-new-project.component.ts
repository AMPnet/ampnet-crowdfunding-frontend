import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ProjectService } from '../project-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { autonumericCurrency, stripCurrencyData } from 'src/app/utilities/currency-util';

declare var $: any;

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit, AfterViewInit {


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

    this.projectService.createProject(
      orgID,
      formValue.name,
      formValue.description,
      "abc",
      formValue.colloqual,
      "10",
      formValue.startDate,
      formValue.endDate,
      parseInt(stripCurrencyData(formValue.expectedFunding)),
      "EUR",
      parseInt(stripCurrencyData(formValue.minPerUser)),
      parseInt(stripCurrencyData(formValue.maxPerUser)),
      false
    ).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      this.router.navigate(['/dash', 'manage_groups', orgID.toString(), 'manage_project', res.uuid]);
    }, err => {
      console.log(err);
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

  projctFetched() {

  }

  ngOnInit() {

    $(document).ready(() => {
      $('#proj-description').summernote({
        height: 300,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: false,
        toolbar: [
          // [groupName, [list of button]]
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['strikethrough', 'superscript', 'subscript']],
          ['fontsize', []],
          ['color', []],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', []]
        ]                  // set focus to editable area after initializing summernote
      });
      autonumericCurrency("#min-per-user-input")
      autonumericCurrency("#max-per-user-input")
      autonumericCurrency("#expected-funding-input")
    })
    
  }

  ngAfterViewInit() {
    
    setTimeout(() => {


      
    }, 200)
    
  }

  submitButtonClicked() { }

}

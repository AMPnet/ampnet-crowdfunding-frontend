import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';
import swal from 'sweetalert2';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { hideAuthButtons } from 'src/app/utilities/ui-utils';
import { displayBackendError } from 'src/app/utilities/error-handler';

declare var initializeIdentyum: any;
declare var $: any;

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {

  constructor(
    private router: Router, 
    private onboardingService: OnboardingService) { }

  ngOnInit() {
    var that = this;

    SpinnerUtil.showSpinner();
    this.onboardingService.getSessionID().subscribe((res: any) => {
      let identyum = initializeIdentyum({
        webSessionUuid: res.token, // SESSION_ID from POST request
        parameters: {},
        onProcessFinishSuccess: function(args) {
          that.onboardingService.verifyUser(res.token).subscribe(res => {
            swal("", "Successfully verified profile", "info")
          }, displayBackendError)
        },
        onWidgetInitialized: function(args) {
          SpinnerUtil.hideSpinner();
        } 
      });
      identyum.load();
      $("#auth-buttons").hide()
    }, err => {
      console.log(err);
    });
  }

  initializeIdentyum() {
    
  }

}



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';
import swal from 'sweetalert2';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';

declare var initializeIdentyum: any;

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
          if(args.status == "success") {
            that.router.navigate(['sign_up'], { queryParams: { web_uuid: res.token }});
          }
        },
        onWidgetInitialized: function(args) {
          SpinnerUtil.hideSpinner();
        } 
      });
      identyum.load();
    }, err => {
      console.log(err);
    });
  }

}



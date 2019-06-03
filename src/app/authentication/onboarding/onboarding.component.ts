import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';
import swal from 'sweetalert2';

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

    this.onboardingService.getSessionID().subscribe((res: any) => {
      let identyum = initializeIdentyum({
        webSessionUuid: res.token, // SESSION_ID from POST request
        parameters: {},
        onProcessFinishSuccess: function(args) {
          if(args.status == "success") {
            that.router.navigateByUrl("/dash");
          }
        } 
      });
      identyum.load();
    }, err => {
      console.log(err);
    });

    

    
  }

}

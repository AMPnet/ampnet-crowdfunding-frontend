import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var initializeIdentyum: any;

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    var that = this;
    let identyum = initializeIdentyum({
      webSessionUuid: '6fce142a-10fb-443a-b379-9bf7a9484226', // SESSION_ID from POST request
      parameters: {},
      onProcessFinishSuccess: function(args) {
        if(args.status == "success") {
          that.router.navigateByUrl("/dash");
        }
      } 
    });

    identyum.load();
  }

}

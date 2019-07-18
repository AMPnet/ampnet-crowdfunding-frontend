import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogInModalService } from './log-in-modal.service';
declare var $: any;
import swal from 'sweetalert2';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';

@Component({
  selector: 'app-log-in-modal',
  templateUrl: './log-in-modal.component.html',
  styleUrls: ['./log-in-modal.component.css']
})
export class LogInModalComponent implements OnInit {

  email: string;
  password: string;

  constructor(private router: Router, 
    private loginService: LogInModalService,
    private auth: AuthService) { }

  ngOnInit() {
  }

  logInFacebookClicked() {
    $('#log-in-modal').modal('toggle');
    this.socialLoginClicked(FacebookLoginProvider.PROVIDER_ID);
  }

  logInGoogleClicked() {
    $('#log-in-modal').modal('toggle');
    this.socialLoginClicked(GoogleLoginProvider.PROVIDER_ID);
  }
  
  socialLoginClicked(provider: string) {
    SpinnerUtil.showSpinner();
    this.auth.signIn(provider).then(res => {
      this.loginService.performSocialLogin(res.provider, res.authToken).subscribe(res => {
        console.log(res);
        localStorage.setItem('access_token', (<any>res).token);
        SpinnerUtil.hideSpinner();
        this.router.navigate(['dash']);
      }, err => {
        SpinnerUtil.hideSpinner();
        swal('', err.error.message, 'warning');
      });
    }, err => {
      SpinnerUtil.hideSpinner();
      swal('', err, 'warning');
    });
  }

  logInMailClicked() {
    SpinnerUtil.showSpinner();
    this.loginService.performEmailLogin(this.email, this.password)
      .subscribe(result => {
        SpinnerUtil.hideSpinner();
        localStorage.setItem('access_token', result.token);
        this.navigateToDash();
      }, error => {
        SpinnerUtil.hideSpinner();
        swal(
          "",
          error.error.description,
          "warning"
        );
      });
  }

  private navigateToDash() {
    $("#log-in-modal").modal('toggle');
    this.router.navigate(['/dash']);
  }

}

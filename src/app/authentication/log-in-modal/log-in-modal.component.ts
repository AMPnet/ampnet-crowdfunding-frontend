import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogInModalService } from './log-in-modal.service';
declare var $: any;
import swal from 'sweetalert2';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

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
    this.auth.signIn(provider).then(res => {
      this.loginService.performSocialLogin(res.provider, res.authToken).subscribe(res => {
        localStorage.setItem('access_token', (<any>res).token);
        this.router.navigate(['dash']);
      }, err => {
        swal('', err.error.message, 'warning');
      });
    }, err => {
      swal('', err, 'warning');
    });
  }

  logInMailClicked() {
    this.loginService.performEmailLogin(this.email, this.password)
      .subscribe(result => {
        localStorage.setItem('access_token', result.token);
        this.navigateToDash();
      }, error => {
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

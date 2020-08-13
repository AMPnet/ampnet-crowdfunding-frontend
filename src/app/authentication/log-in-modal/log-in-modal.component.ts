import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogInModalService } from '../../shared/services/user/log-in-modal.service';
import swal from 'sweetalert2';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';

declare var $: any;

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
                private auth: SocialAuthService) {
    }

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
            this.loginService.performSocialLogin(res.provider, res.authToken)
                .subscribe(backendResponse => {
                    localStorage.setItem('access_token', (<any>backendResponse).access_token);
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
                localStorage.setItem('access_token', result.access_token);
                this.navigateToDash();
            }, (err) => {
                SpinnerUtil.hideSpinner();
                if (err.status === 401) {
                    swal('', 'Invalid email and/or password', 'warning');
                } else {
                    displayBackendError(err);
                }
            });
    }

    private navigateToDash() {
        $('#log-in-modal').modal('toggle');
        this.router.navigate(['/dash']);
    }
}

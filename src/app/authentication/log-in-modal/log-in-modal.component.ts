import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../shared/services/user/user-auth.service';
import swal from 'sweetalert2';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY, of, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
    selector: 'app-log-in-modal',
    templateUrl: './log-in-modal.component.html',
    styleUrls: ['./log-in-modal.component.css']
})
export class LogInModalComponent implements OnInit {
    emailLoginForm: FormGroup;

    constructor(private router: Router,
                private loginService: UserAuthService,
                private auth: SocialAuthService,
                private fb: FormBuilder) {
        this.emailLoginForm = this.fb.group({
            email: fb.control('', Validators.required),
            password: fb.control('', Validators.required)
        });
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
            this.loginService.socialLogin(res.provider, res.authToken)
                .subscribe(_ => {
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
        const loginData = this.emailLoginForm.controls;
        return this.loginService.emailLogin(loginData['email'].value, loginData['password'].value).pipe(
            tap(() => {
                this.navigateToDash();
            }),
            catchError(err => {
                if (err.status === 401) {
                    swal('', 'Invalid email and/or password', 'warning');
                } else {
                    displayBackendError(err);
                }

                return throwError(err);
            })
        );
    }

    private navigateToDash() {
        $('#log-in-modal').modal('toggle');
        this.router.navigate(['/dash']);
    }
}

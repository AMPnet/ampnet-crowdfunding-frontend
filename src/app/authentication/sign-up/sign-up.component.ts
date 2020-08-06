import { Component, OnInit } from '@angular/core';
import { CountryModel } from 'src/app/models/countries/CountryModel';
import { SignUpService } from './sign-up.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { LogInModalService } from '../log-in-modal/log-in-modal.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { MustMatch } from './confirm-password-validator';


@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

    emailSignupForm: FormGroup;

    constructor(
        private signUpService: SignUpService,
        private router: Router,
        private authService: SocialAuthService,
        private route: ActivatedRoute,
        private loginService: LogInModalService,
        private formBuilder: FormBuilder
    ) {
        this.emailSignupForm = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
            email: new FormControl('', [Validators.required, Validators.email])
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    countries: CountryModel[];

    ngOnInit() {
    }

    performGoogleSignup() {
        this.performSocialSignup(GoogleLoginProvider.PROVIDER_ID);
    }

    performFacebookSignup() {
        this.performSocialSignup(FacebookLoginProvider.PROVIDER_ID);
    }

    performSocialSignup(provider: string) {
        SpinnerUtil.showSpinner();

        const that = this;
        const afterSignout: () => void = function () {
            that.authService.signIn(provider).then(res => {

                that.signUpService.performSocialSignup(res.provider,
                    res.authToken).subscribe(usr => {

                    SpinnerUtil.hideSpinner();
                    usr['auth'] = res.authToken;
                    usr['provider'] = res.provider;

                    that.loginService.performSocialLogin(GoogleLoginProvider.PROVIDER_ID, res.authToken)
                        .subscribe(res => {
                            localStorage.setItem('access_token', (<any>res).access_token);
                            that.router.navigate(['/dash']);
                        }, displayBackendError);


                }, err => {

                    SpinnerUtil.hideSpinner();
                    swal('', err.error.message, 'warning');

                });
            }).catch(err => {
                SpinnerUtil.hideSpinner();
                swal('', err, 'warning');
            });
        };
        afterSignout();
    }

    onSubmitEmailForm(formData) {
        SpinnerUtil.showSpinner();
        const values = this.emailSignupForm.value;
        this.signUpService.performEmailSignup(
            values.email,
            values.firstName,
            values.lastName,
            values.password
        ).subscribe((res: any) => {
            swal('', 'Sign-up successful!', 'success');
            this.loginService.performEmailLogin(values.email, values.password).subscribe((res: any) => {
                localStorage.setItem('access_token', res.access_token);
                this.router.navigate(['/dash']);
            }, hideSpinnerAndDisplayError);
        }, hideSpinnerAndDisplayError);
    }
}

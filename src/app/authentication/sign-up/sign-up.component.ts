import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../shared/services/user/signup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { LoginService } from '../../shared/services/user/login.service';
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
        private signUpService: SignupService,
        private router: Router,
        private socialAuthService: SocialAuthService,
        private route: ActivatedRoute,
        private loginService: LoginService,
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

    ngOnInit() {
    }

    performGoogleSignup() {
        this.performSocialSignup(GoogleLoginProvider.PROVIDER_ID);
    }

    performFacebookSignup() {
        this.performSocialSignup(FacebookLoginProvider.PROVIDER_ID);
    }

    async performSocialSignup(provider: string) {
        SpinnerUtil.showSpinner();

        this.socialAuthService.signIn(provider).then(SocialRes => {
            this.signUpService.signupSocial(SocialRes.provider, SocialRes.authToken).subscribe(usr => {
                SpinnerUtil.hideSpinner();

                usr['auth'] = SocialRes.authToken;
                usr['provider'] = SocialRes.provider;

                this.loginService.socialLogin(GoogleLoginProvider.PROVIDER_ID, SocialRes.authToken)
                    .subscribe(LoginRes => {
                        localStorage.setItem('access_token', (<any>LoginRes).access_token);
                        this.router.navigate(['/dash']);
                    }, displayBackendError);
            }, err => {
                SpinnerUtil.hideSpinner();
                swal('', err.error.message, 'warning');
            });
        }).catch(err => {
            SpinnerUtil.hideSpinner();
            swal('', err, 'warning');
        });
    }

    onSubmitEmailForm(formData) {
        SpinnerUtil.showSpinner();
        const values = this.emailSignupForm.value;
        this.signUpService.signupEmail(values.email, values.firstName, values.lastName, values.password)
            .subscribe((_: any) => {
                swal('', 'Sign-up successful!', 'success');
                this.loginService.emailLogin(values.email, values.password).subscribe(res => {
                    localStorage.setItem('access_token', res.access_token);
                    this.router.navigate(['/dash']);
                }, hideSpinnerAndDisplayError);
            }, hideSpinnerAndDisplayError);
    }
}

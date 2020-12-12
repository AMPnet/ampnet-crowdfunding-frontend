import { Component } from '@angular/core';
import { SignupService } from '../../shared/services/user/signup.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { socialAuthServiceProvider, UserAuthService } from '../../shared/services/user/user-auth.service';
import { MustMatch } from './confirm-password-validator';
import { switchMap, tap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';
import { PopupService } from '../../shared/services/popup.service';
import { from } from 'rxjs';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: [
        '../auth-layout/auth-layout.component.scss',
        './sign-up.component.scss'
    ],
    providers: [
        socialAuthServiceProvider
    ]
})
export class SignUpComponent {
    signupForm: FormGroup;

    constructor(private signUpService: SignupService,
                private router: RouterService,
                private socialAuthService: SocialAuthService,
                private route: ActivatedRoute,
                private errorService: ErrorService,
                private loginService: UserAuthService,
                private popupService: PopupService,
                private formBuilder: FormBuilder
    ) {
        this.signupForm = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
            email: new FormControl('', [Validators.required, Validators.email])
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    performGoogleSignup() {
        return this.performSocialSignup(GoogleLoginProvider.PROVIDER_ID);
    }

    performFacebookSignup() {
        return this.performSocialSignup(FacebookLoginProvider.PROVIDER_ID);
    }

    performSocialSignup(provider: string) {
        return from(this.socialAuthService.signIn(provider)).pipe(
            switchMap(socialRes =>
                this.signUpService.signupSocial(socialRes.provider, socialRes.authToken).pipe(
                    switchMap(() => this.loginService.socialLogin(provider, socialRes.authToken))
                )),
            this.errorService.handleError,
            switchMap(() => this.popupService.success('Sign up successful!')),
            tap(() => this.router.navigate(['/dash'])),
        );
    }

    onFormSubmit() {
        const user = this.signupForm.value;

        return this.signUpService.signupEmail(user.email, user.firstName, user.lastName, user.password)
            .pipe(
                switchMap(_ => this.loginService.emailLogin(user.email, user.password)),
                this.errorService.handleError,
                switchMap(() => this.popupService.success('Sign up successful!')),
                tap(() => this.router.navigate(['/dash'])),
            );
    }
}

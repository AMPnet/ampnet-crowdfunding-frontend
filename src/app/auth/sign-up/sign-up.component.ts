import { Component } from '@angular/core';
import { SignupService } from '../../shared/services/user/signup.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { MustMatch } from './confirm-password-validator';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';
import { PopupService } from '../../shared/services/popup.service';
import { EMPTY, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../shared/services/user/user.service';
import { socialAuthServiceProvider } from '../../shared/services/backend-http-client.service';

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
                private translate: TranslateService,
                private userService: UserService,
                private popupService: PopupService,
                private fb: FormBuilder,
    ) {
        this.signupForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        }, <AbstractControlOptions>{
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
        return this.socialAuthService.initState.pipe(
            switchMap(() => from(this.socialAuthService.signIn(provider))),
            catchError(() => EMPTY),
            switchMap(socialRes =>
                this.signUpService.signupSocial(socialRes.provider, socialRes.authToken).pipe(
                    switchMap(() => this.userService.loginSocial(provider, socialRes.authToken))
                )),
            switchMap(() => this.popupService.success(this.translate.instant('auth.sign_up.success'))),
            tap(() => this.router.navigate(['/dash'])),
        );
    }

    onFormSubmit() {
        const user = this.signupForm.value;

        return this.signUpService.signupEmail(user.email, user.password).pipe(
            switchMap(_ => this.userService.loginEmail(user.email, user.password)),
            switchMap(() => this.popupService.success(this.translate.instant('auth.sign_up.success'))),
            tap(() => this.router.navigate(['/dash'])),
        );
    }
}

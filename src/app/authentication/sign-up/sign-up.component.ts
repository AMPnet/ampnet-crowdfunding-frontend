import { Component } from '@angular/core';
import { SignupService } from '../../shared/services/user/signup.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { MustMatch } from './confirm-password-validator';
import { switchMap, tap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';
import { PopupService } from '../../shared/services/popup.service';
import { from } from 'rxjs';
import { ErrorService } from '../../shared/services/error.service';
import { socialAuthServiceProvider, UserService } from '../../shared/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

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
                private translate: TranslateService,
                private userService: UserService,
                private popupService: PopupService,
                private fb: FormBuilder,
    ) {
        this.signupForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
            email: ['', [Validators.required, Validators.email]]
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
        return from(this.socialAuthService.signIn(provider)).pipe(
            switchMap(socialRes =>
                this.signUpService.signupSocial(socialRes.provider, socialRes.authToken).pipe(
                    switchMap(() => this.userService.socialLogin(provider, socialRes.authToken))
                )),
            this.errorService.handleError,
            switchMap(() => this.popupService.success(this.translate.instant('auth.sign_up.success'))),
            tap(() => this.router.navigate(['/dash'])),
        );
    }

    onFormSubmit() {
        const user = this.signupForm.value;

        return this.signUpService.signupEmail(user.email, user.firstName, user.lastName, user.password)
            .pipe(
                switchMap(_ => this.userService.emailLogin(user.email, user.password)),
                this.errorService.handleError,
                switchMap(() => this.popupService.success(this.translate.instant('auth.sign_up.success'))),
                tap(() => this.router.navigate(['/dash'])),
            );
    }
}

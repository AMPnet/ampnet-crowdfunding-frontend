import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { RouterService } from '../../shared/services/router.service';
import { socialAuthServiceProvider, UserAuthService } from '../../shared/services/user/user-auth.service';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { displayBackendErrorRx } from '../../utilities/error-handler';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: [
        '../auth-layout/auth-layout.component.scss',
        './sign-in.component.scss'
    ],
    providers: [
        socialAuthServiceProvider
    ]
})
export class SignInComponent {
    signInForm: FormGroup;

    constructor(private router: RouterService,
                private loginService: UserAuthService,
                private auth: SocialAuthService,
                private fb: FormBuilder) {
        this.signInForm = this.fb.group({
            email: fb.control('', Validators.required),
            password: fb.control('', Validators.required)
        });
    }

    signInFacebook() {
        return this.performSocialSignIn(FacebookLoginProvider.PROVIDER_ID);
    }

    signInGoogle() {
        return this.performSocialSignIn(GoogleLoginProvider.PROVIDER_ID);
    }

    performSocialSignIn(provider: string) {
        return from(this.auth.signIn(provider)).pipe(
            switchMap(res => this.loginService.socialLogin(res.provider, res.authToken)),
            displayBackendErrorRx(),
            tap(() => this.router.navigate(['/dash'])),
        );
    }

    onFormSubmit() {
        const user = this.signInForm.value;

        return this.loginService.emailLogin(user.email, user.password).pipe(
            displayBackendErrorRx(),
            tap(() => this.router.navigate(['/dash'])),
        );
    }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { RouterService } from '../../shared/services/router.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../shared/services/user/user.service';
import { socialAuthServiceProvider } from '../../shared/services/backend-http-client.service';
import { EMPTY } from 'rxjs';

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
                private userService: UserService,
                private socialAuthService: SocialAuthService,
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
        return this.socialAuthService.initState.pipe(
            switchMap(() => this.socialAuthService.signIn(provider)),
            catchError(() => EMPTY),
            switchMap(res => this.userService.loginSocial(res.provider, res.authToken)),
            tap(() => this.router.navigate(['/dash'])),
        );
    }

    onFormSubmit() {
        const user = this.signInForm.value;

        return this.userService.loginEmail(user.email, user.password).pipe(
            tap(() => this.router.navigate(['/dash'])),
        );
    }
}

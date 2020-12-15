import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { switchMap, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { AppConfigService } from '../app-config.service';
import { CaptchaAction, CaptchaService } from '../captcha.service';


@Injectable({
    providedIn: 'root'
})
export class SignupService {
    private endpoint = '/api/user/signup';
    private endpointForgotPassword = '/api/user/forgot-password';

    constructor(private http: BackendHttpClient,
                private appConfig: AppConfigService,
                private captchaService: CaptchaService,
                private userService: UserService) {
    }

    signupEmail(email: string, firstName: string, lastName: string, password: string) {
        return this.captchaService.getToken(CaptchaAction.SIGN_UP).pipe(
            switchMap(captchaToken => {
                return this.http.post<User>(this.endpoint, <EmailSignupData>{
                    coop: this.appConfig.config.identifier,
                    signup_method: 'EMAIL',
                    user_info: {
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    },
                    re_captcha_token: captchaToken
                }, true).pipe(tap(() => this.userService.refreshUser()));
            })
        );
    }

    signupSocial(provider: string, authToken: string) {
        return this.captchaService.getToken(CaptchaAction.SIGN_UP).pipe(
            switchMap(captchaToken => {
                return this.http.post<User>(this.endpoint, <SocialSignupData>{
                    coop: this.appConfig.config.identifier,
                    signup_method: provider,
                    user_info: {
                        token: authToken
                    },
                    re_captcha_token: captchaToken
                }, true).pipe(tap(() => this.userService.refreshUser()));
            }));
    }

    forgotPassword(email: string) {
        return this.http.post(`${this.endpointForgotPassword}/token`, {
            coop: this.appConfig.config.identifier,
            email: email
        }, true);
    }

    resetPassword(newPassword: string, token: string) {
        return this.http.post<User>(`${this.endpointForgotPassword}`, {
            new_password: newPassword,
            token: token
        }, true);
    }
}

export interface User {
    uuid: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    enabled: boolean;
    verified: boolean;
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    PLATFORM_MANAGER = 'PLATFORM_MANAGER',
    TOKEN_ISSUER = 'TOKEN_ISSUER',
}

interface EmailSignupData {
    signup_method: 'EMAIL';
    user_info: {
        password: string;
        last_name: string;
        first_name: string;
        email: string;
    };
    re_captcha_token: string;
}

interface SocialSignupData {
    signup_method: string;
    user_info: {
        token: string
    };
    re_captcha_token: string;
}

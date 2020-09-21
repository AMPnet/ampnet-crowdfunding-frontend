import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';


@Injectable({
    providedIn: 'root'
})
export class SignupService {
    private endpoint = '/api/user/signup';

    constructor(private http: BackendHttpClient,
                private userService: UserService) {
    }

    signupEmail(email: string, firstName: string, lastName: string, password: string) {
        return this.http.post<User>(this.endpoint, <EmailSignupData>{
            signup_method: 'EMAIL',
            user_info: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            }
        }).pipe(tap(() => this.userService.refreshUser()));
    }

    signupSocial(provider: string, authToken: string) {
        return this.http.post<User>(this.endpoint, <SocialSignupData>{
            signup_method: provider,
            user_info: {
                token: authToken
            }
        }).pipe(tap(() => this.userService.refreshUser()));
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
}

interface SocialSignupData {
    signup_method: string;
    user_info: {
        token: string
    };
}

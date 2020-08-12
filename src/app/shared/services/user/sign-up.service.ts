import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';


@Injectable({
    providedIn: 'root'
})
export class SignUpService {
    private endpoint = '/api/user/signup';
    private checkEmailEndpoint = '/api/user/mail-check';

    constructor(private http: BackendApiService) {
    }

    performEmailSignup(email: string, firstName: string, lastName: string, password: string) {
        return this.http.post<User>(this.endpoint, <EmailSignupData>{
            signup_method: 'EMAIL',
            user_info: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            }
        });
    }

    performSocialSignup(provider: string, authToken: string) {
        return this.http.post<User>(this.endpoint, <SocialSignupData>{
            signup_method: provider,
            user_info: {
                token: authToken
            }
        });
    }

    checkEmail(email: string, onComplete: (userExists: boolean) => void) {
        return this.http.post(this.checkEmailEndpoint, {
            'email': email
        }).subscribe((res: any) => {
            onComplete(res.userExists);
        }, err => {
            // TODO: Handle error
        });
    }
}

export interface User {
    uuid: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    enabled: boolean;
    verified: boolean;
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

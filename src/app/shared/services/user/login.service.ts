import { Injectable } from '@angular/core';
import { TokenModel } from 'src/app/models/auth/TokenModel';
import { BackendHttpClient } from '../backend-http-client.service';


@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private endpoint = '/api/user/token';

    constructor(private http: BackendHttpClient) {
    }

    emailLogin(email: string, password: string) {
        return this.http.post<TokenModel>(this.endpoint, {
            login_method: 'EMAIL',
            credentials: {
                email: email,
                password: password
            }
        });
    }

    socialLogin(provider: string, authToken: string) {
        return this.http.post<TokenModel>(this.endpoint, {
            login_method: provider,
            credentials: {
                token: authToken
            }
        });
    }
}

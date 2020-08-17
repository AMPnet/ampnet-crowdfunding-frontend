import { Injectable } from '@angular/core';
import { API } from '../../utilities/endpoint-manager';
import { HttpClient } from '@angular/common/http';
import { TokenModel } from 'src/app/models/auth/TokenModel';


@Injectable({
    providedIn: 'root'
})
export class LogInModalService {

    private endpoint = '/user/token';

    constructor(private http: HttpClient) {
    }

    performEmailLogin(
        email: string,
        password: string
    ) {
        return this.http.post<TokenModel>(API.generateRoute(this.endpoint), {
            'login_method': 'EMAIL',
            'credentials': {
                'email': email,
                'password': password
            }
        });
    }

    performSocialLogin(provider: string, authToken: string) {
        return this.http.post(API.generateRoute(this.endpoint), {
            'login_method': provider,
            'credentials': {
                'token': authToken
            }
        });
    }
}

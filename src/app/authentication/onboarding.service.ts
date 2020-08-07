import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    endpoint = '/user/identyum/token';
    verifyEndpoint = '/user/me/verify';

    constructor(private http: HttpClient) {
    }

    getSessionID() {
        return this.http.get(API.generateRoute(this.endpoint));
    }

    verifyUser(sessionState: string) {
        return this.http.post(API.generateRoute(this.verifyEndpoint), {
            'session_state': sessionState
        }, API.tokenHeaders());
    }
}

import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { User } from './signup.service';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    constructor(private http: BackendHttpClient) {
    }

    getSessionID() {
        return this.http.get<IdentyumLoginResponse>('/api/user/identyum/token');
    }

    verifyUser(sessionState: string) {
        return this.http.post<User>('/api/user/me/verify', <VerifyUserData>{
            session_state: sessionState
        });
    }
}

interface IdentyumLoginResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    session_state: string;
}

interface VerifyUserData {
    session_state: string;
}

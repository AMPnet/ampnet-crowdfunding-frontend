import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { User } from './signup.service';

@Injectable({
    providedIn: 'root'
})
export class IdentyumService {
    constructor(private http: BackendHttpClient) {
    }

    getSessionID() {
        return this.http.get<IdentyumClientToken>('/api/user/identyum/token');
    }

    verifyUser(sessionState: string) {
        return this.http.post<User>('/api/user/identyum/verify', <VerifyUserData>{
            session_state: sessionState
        });
    }
}

export interface IdentyumClientToken {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    session_state: string;
}

interface VerifyUserData {
    session_state: string;
}

import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class IdentyumService {
    constructor(private http: BackendHttpClient) {
    }

    getSession() {
        return this.http.get<IdentyumSession>('/api/user/identyum/token');
    }
}

export interface IdentyumSession {
    web_component_url: string;
    credentials: IdentyumCredentials;
}

export interface IdentyumCredentials {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    session_state: string;
}

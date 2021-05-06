import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class JwtTokenService {
    constructor(private appConfig: AppConfigService,
                private http: HttpClient) {
    }

    authEmail(email: string, password: string) {
        return this.http.post<UserAuthResponse>('/api/user/token', {
            coop: this.appConfig.config.identifier,
            login_method: 'EMAIL',
            credentials: {
                email: email,
                password: password
            }
        }).pipe(
            this.saveTokens()
        );
    }

    authSocial(provider: string, authToken: string) {
        return this.http.post<UserAuthResponse>('/api/user/token', {
            coop: this.appConfig.config.identifier,
            login_method: provider,
            credentials: {
                token: authToken
            }
        }).pipe(
            this.saveTokens()
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`/api/user/logout`, {}).pipe(
            catchError(_ => of(null)),
            tap(() => {
                this.accessToken = null;
                this.refreshToken = null;
            }),
        );
    }

    isLoggedIn(): boolean {
        const jwtUser = this.getJWTUser();

        return jwtUser && jwtUser.coop === this.appConfig.config.identifier;
    }

    refreshAccessToken() {
        return this.http.post<UserAuthResponse>('/api/user/token/refresh', {
            refresh_token: this.refreshToken
        }).pipe(
            this.saveTokens(),
        );
    }

    removeTokens() {
        this.accessToken = null;
        this.refreshToken = null;
    }

    getJWTUser(): JWTUser | null {
        try {
            const payload: JWTPayload = JSON.parse(atob(this.accessToken.split('.')[1]));
            return JSON.parse(payload.user);
        } catch (_err) {
            return null;
        }
    }

    get accessToken() {
        return localStorage.getItem(this.scopedKey('access_token'));
    }

    set accessToken(value: string) {
        !value ? localStorage.removeItem(this.scopedKey('access_token')) :
            localStorage.setItem(this.scopedKey('access_token'), String(value));
    }

    get refreshToken() {
        return localStorage.getItem(this.scopedKey('refresh_token'));
    }

    set refreshToken(value: unknown) {
        !value ? localStorage.removeItem(this.scopedKey('refresh_token')) :
            localStorage.setItem(this.scopedKey('refresh_token'), String(value));
    }

    private scopedKey(key: string) {
        return `${this.appConfig.config.identifier}_${key}`;
    }

    private saveTokens = () => (source: Observable<UserAuthResponse>) => {
        return source.pipe(
            tap(res => {
                this.accessToken = res.access_token;
                this.refreshToken = res.refresh_token;
            })
        );
    }
}

interface UserAuthResponse {
    access_token: string;
    expires_in: number; // millis
    refresh_token: string;
    refresh_token_expires_in: number; // millis
}

interface JWTPayload {
    sub: string;
    user: string;
    iat: number;
    exp: number;
}

interface JWTUser {
    uuid: string;
    email: string;
    name: string;
    authorities: string[];
    enabled: boolean;
    verified: boolean;
    coop: string;
}

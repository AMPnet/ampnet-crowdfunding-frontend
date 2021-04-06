import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BackendHttpClient {
    constructor(public http: HttpClient,
                private appConfig: AppConfigService) {
    }

    get<T>(path: string, params?: object, publicRoute = false): Observable<T> {
        return of('').pipe(
            switchMap(() => {
                const httpOptions = this.authHttpOptions(publicRoute);

                if (params !== undefined) {
                    httpOptions['params'] = params;
                }

                return this.http.get<T>(path, httpOptions);
            })
        );
    }

    post<T>(path: string, body: any, publicRoute = false): Observable<T> {
        return of('').pipe(
            switchMap(() => this.http.post<T>(path, body, this.authHttpOptions(publicRoute)))
        );
    }

    put<T>(path: string, body: object): Observable<T> {
        return of('').pipe(
            switchMap(() => this.http.put<T>(path, body, this.authHttpOptions()))
        );
    }

    delete<T>(path: string, params?: object): Observable<T> {
        return of('').pipe(
            switchMap(() => {
                const httpOptions = this.authHttpOptions();
                if (params !== undefined) {
                    httpOptions['params'] = params;
                }

                return this.http.delete<T>(path, httpOptions);
            })
        );
    }

    public authHttpOptions(publicRoute = false) {
        const httpOptions = {
            headers: new HttpHeaders()
        };
        httpOptions.headers.append('Connection', 'Keep-Alive');

        if (this.accessToken !== null && !publicRoute) {
            httpOptions.headers = httpOptions
                .headers.append('Authorization', `Bearer ${this.accessToken}`);
        }

        return httpOptions;
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

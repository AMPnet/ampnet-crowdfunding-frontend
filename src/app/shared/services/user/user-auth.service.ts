import { Injectable } from '@angular/core';
import { TokenModel } from 'src/app/models/auth/TokenModel';
import { BackendHttpClient } from '../backend-http-client.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { CacheService } from '../cache.service';


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    constructor(private http: BackendHttpClient,
                private userService: UserService,
                private cacheService: CacheService) {
    }

    emailLogin(email: string, password: string) {
        return this.http.post<TokenModel>('/api/user/token', {
            login_method: 'EMAIL',
            credentials: {
                email: email,
                password: password
            }
        }).pipe(this.saveTokens);
    }

    socialLogin(provider: string, authToken: string) {
        return this.http.post<TokenModel>('/api/user/token', {
            login_method: provider,
            credentials: {
                token: authToken
            }
        }).pipe(this.saveTokens);
    }

    refreshUserToken() {
        return this.http.post<TokenModel>('/api/user/token/refresh', {
            refresh_token: localStorage.getItem('refresh_token')
        }).pipe(
            this.saveTokens,
            tap(() => this.userService.refreshUser())
        );
    }

    logout() {
        this.http.post<void>(`/api/user/logout`, {})
            .pipe(catchError(_ => EMPTY)).subscribe();

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        this.cacheService.clearAll();
    }

    private saveTokens(source: Observable<TokenModel>) {
        return source.pipe(
            tap(res => {
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('refresh_token', res.refresh_token);
            })
        );
    }
}

import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { CacheService } from '../cache.service';
import { AppConfigService } from '../app-config.service';
import { SocialAuthService } from 'angularx-social-login';


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    constructor(private http: BackendHttpClient,
                private userService: UserService,
                private appConfig: AppConfigService,
                private cacheService: CacheService) {
    }

    emailLogin(email: string, password: string) {
        return this.http.post<UserAuthResponse>('/api/user/token', {
            coop: this.appConfig.config.identifier,
            login_method: 'EMAIL',
            credentials: {
                email: email,
                password: password
            }
        }, true).pipe(this.saveTokens.bind(this));
    }

    socialLogin(provider: string, authToken: string) {
        return this.http.post<UserAuthResponse>('/api/user/token', {
            coop: this.appConfig.config.identifier,
            login_method: provider,
            credentials: {
                token: authToken
            }
        }, true).pipe(this.saveTokens.bind(this));
    }

    refreshUserToken() {
        return this.http.post<UserAuthResponse>('/api/user/token/refresh', {
            refresh_token: this.http.refreshToken
        }, true).pipe(
            this.saveTokens.bind(this),
            tap(() => this.userService.refreshUser())
        );
    }

    logout() {
        this.http.post<void>(`/api/user/logout`, {})
            .pipe(catchError(_ => EMPTY)).subscribe();

        this.http.accessToken = null;
        this.http.refreshToken = null;

        this.cacheService.clearAll();
    }

    private saveTokens(source: Observable<UserAuthResponse>) {
        return source.pipe(
            tap(res => {
                this.http.accessToken = res.access_token;
                this.http.refreshToken = res.refresh_token;
            })
        );
    }

    isLoggedIn(): boolean {
        const jwtUser = this.http.getJWTUser();

        return jwtUser && jwtUser.coop === this.appConfig.config.identifier;
    }
}

export class UserAuthResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
}

export const socialAuthServiceFactory = (appConfig: AppConfigService) => {
    return new SocialAuthService(appConfig.socialAuthConfig());
};

export const socialAuthServiceProvider = {
    provide: SocialAuthService,
    useFactory: socialAuthServiceFactory,
    deps: [AppConfigService]
};

import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User, UserRole } from './signup.service';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { CacheService } from '../cache.service';
import { AppConfigService } from '../app-config.service';
import { SocialAuthService } from 'angularx-social-login';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private cacheKey = 'user/me';

    private refreshUserSubject = new BehaviorSubject<void>(null);

    user$: Observable<User> = this.refreshUserSubject.asObservable().pipe(
        switchMap(() => this.cacheService.setAndGet(this.cacheKey, this.getFreshUser())));

    constructor(private http: BackendHttpClient,
                private appConfig: AppConfigService,
                private cacheService: CacheService) {
    }

    private getFreshUser() {
        return this.http.get<User>('/api/user/me').pipe(
            switchMap(user => user.role === this.getRoleFromAuthorities() ?
                of(user) : this.refreshUserToken().pipe(switchMap(() => of(user)))
            )
        );
    }

    private getRoleFromAuthorities(): UserRole {
        return this.http.getJWTUser().authorities
            .filter(authority => authority.startsWith('ROLE'))
            .map(authority => authority.replace('ROLE_', ''))
            .shift() as UserRole;
    }

    refreshUser() {
        this.cacheService.clear(this.cacheKey);
        this.refreshUserSubject.next();
    }

    getUserByEmail(email: string): Observable<User | null> {
        return this.http.get<PageableUsersResponse>('/api/user/admin/user/find', {
            email: email
        }).pipe(
            map(res => res.users[0] || null),
            catchError(err => err.status === 404 ? of(null) : throwError(err))
        );
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
            tap(() => this.refreshUser())
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

interface PageableUsersResponse {
    users: User[];
    page: number;
    total_pages: number;
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

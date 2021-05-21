import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { defer, EMPTY, Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { ErrorService } from './error.service';
import { finalize, tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { SocialAuthService } from 'angularx-social-login';
import { JwtTokenService } from './jwt-token.service';
import { AnalyticsService } from './analytics.service';

@Injectable({
    providedIn: 'root'
})
export class BackendHttpClient {
    constructor(public http: HttpClient,
                private errorService: ErrorService,
                private cacheService: CacheService,
                private analytics: AnalyticsService,
                private jwtTokenService: JwtTokenService) {
    }

    get<T>(path: string, params?: object, publicRoute = false, shouldHandleErrors = true): Observable<T> {
        return defer(() => {
            const httpOptions = this.authHttpOptions(publicRoute);

            if (params !== undefined) {
                httpOptions['params'] = params;
            }

            return this.http.get<T>(path, httpOptions);
        }).pipe(this.handleError(shouldHandleErrors));
    }

    post<T>(path: string, body: any, publicRoute = false, shouldHandleErrors = true): Observable<T> {
        return defer(() => this.http.post<T>(path, body, this.authHttpOptions(publicRoute))).pipe(
            this.handleError(shouldHandleErrors)
        );
    }

    put<T>(path: string, body: object, shouldHandleErrors = true): Observable<T> {
        return defer(() => this.http.put<T>(path, body, this.authHttpOptions())).pipe(
            this.handleError(shouldHandleErrors)
        );
    }

    delete<T>(path: string, params?: object, shouldHandleErrors = true): Observable<T> {
        return defer(() => {
            const httpOptions = this.authHttpOptions();
            if (params !== undefined) {
                httpOptions['params'] = params;
            }

            return this.http.delete<T>(path, httpOptions);
        }).pipe(
            this.handleError(shouldHandleErrors)
        );
    }

    loginEmail(email: string, password: string) {
        return this.jwtTokenService.authEmail(email, password).pipe(
            this.errorService.handleError
        );
    }

    loginSocial(provider: string, authToken: string) {
        return this.jwtTokenService.authSocial(provider, authToken).pipe(
            this.errorService.handleError
        );
    }

    logout(): Observable<void> {
        return this.jwtTokenService.logout().pipe(
            finalize(() => {
                this.cacheService.clearAll();
                this.analytics.clearUser();
            })
        );
    }

    public authHttpOptions(publicRoute = false) {
        const httpOptions = {
            headers: new HttpHeaders()
        };
        httpOptions.headers.append('Connection', 'Keep-Alive');

        if (this.jwtTokenService.accessToken !== null && !publicRoute) {
            httpOptions.headers = httpOptions
                .headers.append('Authorization', `Bearer ${this.jwtTokenService.accessToken}`);
        }

        return httpOptions;
    }

    private handleError = (handleErrors: boolean) => (source: Observable<any>) =>
        source.pipe(handleErrors ? this.errorService.handleError : () => EMPTY);
}

export const socialAuthServiceFactory = (appConfig: AppConfigService) => {
    return new SocialAuthService(appConfig.socialAuthConfig());
};

export const socialAuthServiceProvider = {
    provide: SocialAuthService,
    useFactory: socialAuthServiceFactory,
    deps: [AppConfigService]
};

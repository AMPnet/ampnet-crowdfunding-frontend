import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User, UserRole } from './signup.service';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { CacheService } from '../cache.service';
import { AppConfigService } from '../app-config.service';
import { LanguageService } from '../language.service';
import { JwtTokenService } from '../jwt-token.service';

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
                private languageService: LanguageService,
                private jwtTokenService: JwtTokenService,
                private cacheService: CacheService) {
    }

    private getFreshUser() {
        return this.http.get<User>('/api/user/me').pipe(
            switchMap(user => this.checkIntegrity(user) ?
                of(user) : this.jwtTokenService.refreshAccessToken().pipe(switchMap(() => of(user)))
            ),
            switchMap(user => this.checkDefaultLang(user) ?
                of(user) : this.updateUser({language: this.languageService.getPreferredLang()}) as Observable<User>
            ),
            map(user => ({
                ...user,
                verified: this.isVerified(user.verified)
            }))
        );
    }

    isVerified(userVerified: boolean) {
        return !this.appConfig.config.need_user_verification || userVerified;
    }

    private checkIntegrity(user: User): boolean {
        return user.role === this.getRoleFromAuthorities()
            && this.isVerified(user.verified) === this.jwtTokenService.getJWTUser().verified;
    }

    private checkDefaultLang(user: User): boolean {
        return user.language === this.languageService.getPreferredLang();
    }

    private getRoleFromAuthorities(): UserRole {
        return this.jwtTokenService.getJWTUser().authorities
            .filter(authority => authority.startsWith('ROLE'))
            .map(authority => authority.replace('ROLE_', ''))
            .shift() as UserRole;
    }

    refreshUser() {
        this.cacheService.clear(this.cacheKey);
        this.refreshUserSubject.next();
    }

    updateUser(updateData: UpdateUserData): Observable<User> {
        return this.jwtTokenService.isLoggedIn() ?
            this.http.put<User>('/api/user/me/update', updateData) : EMPTY;
    }

    getUserByEmail(email: string): Observable<User | null> {
        return this.http.get<PageableUsersResponse>('/api/user/admin/user/find', {
            email: email
        }).pipe(
            map(res => res.users[0] || null),
            catchError(err => err.status === 404 ? of(null) : throwError(err))
        );
    }

    loginEmail(email: string, password: string) {
        return this.http.loginEmail(email, password).pipe(
            tap(() => this.updateBackendLanguage.subscribe())
        );
    }

    loginSocial(provider: string, authToken: string) {
        return this.http.loginSocial(provider, authToken).pipe(
            tap(() => this.updateBackendLanguage.subscribe())
        );
    }

    get updateBackendLanguage() {
        return this.updateUser({language: this.languageService.getCurrentLanguage()}).pipe(
            catchError(() => EMPTY)
        );
    }

    refreshUserToken() {
        return this.jwtTokenService.refreshAccessToken().pipe(
            tap(() => this.refreshUser())
        );
    }
}

interface PageableUsersResponse {
    users: User[];
    page: number;
    total_pages: number;
}

interface UpdateUserData {
    language: string;
}

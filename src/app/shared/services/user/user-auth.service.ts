import { Injectable } from '@angular/core';
import { TokenModel } from 'src/app/models/auth/TokenModel';
import { BackendHttpClient } from '../backend-http-client.service';
import { Observable } from 'rxjs';
import { WalletDetails } from '../wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { tap } from 'rxjs/operators';
import { UserStatusStorage } from '../../../user-status-storage';
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
        return this.http.post<void>(`/api/user/logout`, {})
            .pipe(this.removeTokens, tap(_ => this.cacheService.clearAll()));
    }

    private saveTokens(source: Observable<TokenModel>) {
        return source.pipe(
            tap(res => {
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('refresh_token', res.refresh_token);
            })
        );
    }

    private removeTokens<T>(source: Observable<T>) {
        return source.pipe(
            tap(_ => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            })
        );
    }
}

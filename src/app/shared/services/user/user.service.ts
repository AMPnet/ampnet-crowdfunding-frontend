import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendHttpClient } from '../backend-http-client.service';
import { tap } from 'rxjs/operators';
import { User } from './signup.service';
import { Observable, ReplaySubject } from 'rxjs';
import { TokenModel } from '../../../models/auth/TokenModel';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userChange$: Observable<User>;

    userChangeSubject = new ReplaySubject<User>();

    constructor(private http: BackendHttpClient) {
        this.userChange$ = this.userChangeSubject.asObservable();
    }

    getOwnProfile() {
        return this.http.get<User>('/api/user/me')
            .pipe(this.tapUserChange.bind(this));
    }

    private tapUserChange(source: Observable<User>) {
        return source.pipe(
            tap(user => {
                UserStatusStorage.personalData = user;
                this.userChangeSubject.next(user);
            })
        );
    }

    logout() {
        return this.http.post<void>(`/api/user/logout`, {})
            .pipe(tap(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }));
    }

    refreshUserToken() {
        return this.http.post<TokenModel>('/api/user/token/refresh', {
            refresh_token: localStorage.getItem('refresh_token')
        }).pipe(tap((data) => {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
        }));
    }
}

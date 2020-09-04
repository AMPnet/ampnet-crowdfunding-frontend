import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendHttpClient } from '../backend-http-client.service';
import { tap } from 'rxjs/operators';
import { User } from './signup.service';
import { Observable, ReplaySubject } from 'rxjs';

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
        return this.http.post<void>(`/api/user/logout`, {});
    }
}

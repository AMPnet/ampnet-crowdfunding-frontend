import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendHttpClient } from '../backend-http-client.service';
import { tap } from 'rxjs/operators';
import { User } from './signup.service';
import { TokenModel } from '../../../models/auth/TokenModel';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userChange$: Observable<User>;

    private userChangeSubject = new ReplaySubject<User>(1);

    constructor(private http: BackendHttpClient) {
        this.userChange$ = this.userChangeSubject.asObservable();
    }

    getOwnProfile() {
        return this.http.get<User>('/api/user/me')
            .pipe(tap(user => {
                UserStatusStorage.personalData = user;
                this.userChangeSubject.next(user);
            }));
    }
}

import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendHttpClient } from '../backend-http-client.service';
import { tap } from 'rxjs/operators';
import { User } from './signup.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userVerifiedSubject = new Subject<boolean>();
    currentState = this.userVerifiedSubject.asObservable();

    constructor(private http: BackendHttpClient) {
    }

    getOwnProfile() {
        return this.http.get<User>('/api/user/me')
            .pipe(tap(user => UserStatusStorage.personalData = user));
    }

    isUserVerified(state: boolean) {
        this.userVerifiedSubject.next(state);
    }

    logout() {
        return this.http.post<void>(`/api/user/logout`, {});
    }
}

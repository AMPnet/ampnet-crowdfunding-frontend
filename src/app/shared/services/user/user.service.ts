import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { repeatWhen, switchMap, tap } from 'rxjs/operators';
import { User } from './signup.service';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { CacheService } from '../cache.service';
import { UserStatusStorage } from '../../../user-status-storage';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private refreshUserSubject = new BehaviorSubject<void>(null);
    private freshUser$ = this.http.get<User>('/api/user/me');

    user$: Observable<User> = this.refreshUserSubject.asObservable().pipe(
        switchMap(() => this.cacheService.setAndGet('user/me', this.freshUser$))
    );

    constructor(private http: BackendHttpClient,
                private cacheService: CacheService) {
    }

    refreshUser() {
        this.cacheService.clear('user/me');
        this.refreshUserSubject.next();
    }
}

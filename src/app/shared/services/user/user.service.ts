import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { switchMap } from 'rxjs/operators';
import { User } from './signup.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from '../cache.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private cacheKey = 'user/me';

    private refreshUserSubject = new BehaviorSubject<void>(null);

    user$: Observable<User> = this.refreshUserSubject.asObservable().pipe(
        switchMap(() => this.cacheService.setAndGet(this.cacheKey, this.getFreshUser())));

    constructor(private http: BackendHttpClient,
                private cacheService: CacheService) {
    }

    private getFreshUser() {
        return this.http.get<User>('/api/user/me');
    }

    refreshUser() {
        this.cacheService.clear(this.cacheKey);
        this.refreshUserSubject.next();
    }
}

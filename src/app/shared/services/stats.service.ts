import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendHttpClient } from './backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    constructor(private http: BackendHttpClient) {
    }

    users(): Observable<StatsUsersRes> {
        // return this.http.get<StatsUsersRes>('/api/user/admin/user/count');
        return of(<StatsUsersRes>{ // TODO: remove this mock after its implemented on backend.
            registered: 4,
            verified: 5,
        });
    }

    wallets(): Observable<StatsWalletsRes> {
        // return this.http.get<StatsWalletsRes>('/api/wallet/admin/stats');
        return of(<StatsWalletsRes>{ // TODO: remove this mock after its implemented on backend.
            wallets_initialized: 23,
            users_deposited: 4,
            users_invested: 5,
        });
    }
}

interface StatsUsersRes {
    registered: number;
    verified: number;
}

interface StatsWalletsRes {
    wallets_initialized: number;
    users_deposited: number;
    users_invested: number;
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendHttpClient } from './backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    constructor(private http: BackendHttpClient) {
    }

    users(): Observable<StatsUsersRes> {
        return this.http.get<StatsUsersRes>('/api/user/admin/user/count');
    }

    wallets(): Observable<StatsWalletsRes> {
        return this.http.get<StatsWalletsRes>('/api/wallet/admin/stats');
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

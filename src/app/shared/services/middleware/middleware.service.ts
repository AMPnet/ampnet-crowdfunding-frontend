import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { Observable } from 'rxjs';
import { CacheService } from '../cache.service';

@Injectable({
    providedIn: 'root'
})
export class MiddlewareService {
    constructor(private http: BackendHttpClient,
                private cacheService: CacheService) {
    }

    getProjectWalletInfo(walletHash: string): Observable<ProjectWalletInfo> {
        return this.http.get<ProjectWalletInfo>(`/api/middleware/projects/${walletHash}`);
    }

    getProjectWalletInfoCached(walletHash: string) {
        return this.cacheService.setAndGet(
            `project_wallet_info/${walletHash}`, this.getProjectWalletInfo(walletHash), 60_000);
    }
}

export interface ProjectWalletInfo {
    projectHash: string;
    minPerUserInvestment: number;
    maxPerUserInvestment: number;
    investmentCap: number;
    endsAt: number;
    totalFundsRaised: number;
    payoutInProcess: boolean;
    balance: number;
}

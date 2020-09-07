import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MiddlewareService {
    constructor(private http: BackendHttpClient) {
    }

    getProjectWalletInfo(walletHash: string): Observable<ProjectWalletInfo> {
        return this.http.get<ProjectWalletInfo>(`/api/middleware/projects/${walletHash}`);
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

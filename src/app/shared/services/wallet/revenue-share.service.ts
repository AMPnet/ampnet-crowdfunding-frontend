import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class RevenueShareService {
    constructor(private http: BackendApiService) {
    }

    getProjectWallet(projectID: number) {
        return this.http.get(`/api/wallet/public/wallet/project/${projectID}`);
    }

    generateRevenueShareTx(projectID: string, amount: number) {
        return this.http.post(`/api/wallet/revenue/payout/project/${projectID}`, {
            amount: amount.toString()
        });
    }
}

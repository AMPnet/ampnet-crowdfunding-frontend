import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { TransactionInfo } from './wallet-cooperative/wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class RevenueShareService {
    constructor(private http: BackendHttpClient) {
    }

    generateRevenueShareTx(projectID: string, amount: number) {
        return this.http.post<TransactionInfo>(`/api/wallet/revenue/payout/project/${projectID}`, {
            amount: amount.toString()
        });
    }
}

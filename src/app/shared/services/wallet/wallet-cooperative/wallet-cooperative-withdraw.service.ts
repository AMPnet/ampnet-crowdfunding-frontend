import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../../backend-http-client.service';
import { Withdraw } from '../withdraw.service';
import { User } from '../../user/signup.service';
import { Project } from '../../project/project.service';
import { TransactionInfo } from '../wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WalletCooperativeWithdrawService {
    endpoint = '/api/wallet/cooperative/withdraw';

    constructor(private http: BackendHttpClient) {
    }

    generateBurnWithdrawTx(withdrawID: number) {
        return this.http.post<TransactionInfo>(`${this.endpoint}/${withdrawID}/transaction/burn`, {});
    }

    getApprovedWithdrawals() {
        return this.http.get<CoopWithdrawListResponse>(`${this.endpoint}/approved?type=${WithdrawRelation.USER}`);
    }

    getApprovedProjectWithdrawals() {
        return this.http.get<CoopWithdrawListResponse>(`${this.endpoint}/approved?type=${WithdrawRelation.PROJECT}`);
    }

    getApprovedWithdrawal(id: number) {
        return this.http.get<CoopWithdraw>(`${this.endpoint}/approved/${id}`);
    }
}

export interface CoopWithdrawListResponse {
    withdraws: CoopWithdraw[];
    page: number;
    total_pages: number;
}

export interface CoopWithdraw {
    withdraw: Withdraw;
    user: User;
    project?: Project;
    wallet_hash: string;
}

enum WithdrawRelation {
    USER = 'USER',
    PROJECT = 'PROJECT'
}

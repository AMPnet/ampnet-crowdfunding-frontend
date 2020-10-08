import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../../backend-http-client.service';
import { TransactionInfo } from './wallet-cooperative-wallet.service';
import { Withdraw } from '../withdraw.service';

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
        return this.http.get<UserWithdrawListResponse>(`${this.endpoint}/approved`);
    }

    getApprovedProjectWithdraws() {
        return this.http.get<ProjectWithdrawListResponse>(`${this.endpoint}/approved/project`);
    }

    getBurnedProjectWithdrawals() {
        return this.http.get<ProjectWithdrawListResponse>(`${this.endpoint}/burned/project`);
    }

    uploadDocument(withdrawID: number) {
        // TODO: send document data as file
        return this.http.get<Withdraw>(`${this.endpoint}/${withdrawID}/document`);
    }
}

interface UserWithdrawListResponse {
    withdraws: UserWithdraw[];
    page: number;
    total_pages: number;
}

export interface UserWithdraw {
    id: number;
    user: {
        uuid: string;
        email: string;
        first_name: string;
        last_name: string;
        enabled: boolean;
    };
    amount: number;
    approved_tx_hash: string;
    approved_at: Date;
    burned_tx_hash?: string;
    burned_by?: string;
    burned_at?: Date;
    created_at: Date;
    bank_account: string;
    user_wallet: string;
    document_response?: {
        id: number;
        link: string;
        name: string;
        type: string;
        size: number;
        created_at: Date;
    };
}

interface ProjectWithdrawListResponse {
    withdraws: ProjectWithdraw[];
    page: number;
    total_pages: number;
}

export interface ProjectWithdraw {
    id: number;
    project: {
        uuid: string;
        name: string;
        description: string;
        end_date: Date;
        expected_funding: number;
        currency: string;
        min_per_user: number;
        max_per_user: number;
        active: boolean;
        image_url: string;
    };
    amount: number;
    approved_tx_hash: string;
    approved_at: Date;
    burned_tx_hash?: any;
    burned_by?: string;
    burned_at?: Date;
    created_at: Date;
    bank_account: string;
    project_wallet: string;
    document_response?: {
        id: number;
        link: string;
        name: string;
        type: string;
        size: number;
        created_at: Date;
    };
}

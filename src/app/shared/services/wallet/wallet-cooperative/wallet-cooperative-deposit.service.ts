import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../../backend-http-client.service';
import { TransactionInfo } from './wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WalletCooperativeDepositService {
    private endpoint = '/api/wallet/cooperative/deposit';

    constructor(private http: BackendHttpClient) {
    }

    getDeposit(reference: string) {
        return this.http.get<DepositSearchResponse>(`${this.endpoint}/search`, {
            reference: reference
        });
    }

    generateDepositApprovalURL(origin: string, id: number, amount: number) {
        return `${origin}${this.endpoint}/${id}/approve?amount=${amount}`;
    }

    getUnapprovedDeposits() {
        return this.http.get<DepositListResponse>(`${this.endpoint}/unapproved`);
    }

    getApprovedDeposits() {
        return this.http.get<DepositListResponse>(`${this.endpoint}/approved`);
    }

    declineDeposit(id: number, comment: string) {
        return this.http.post<Deposit>(`${this.endpoint}/${id}/decline`, {
            comment: comment
        });
    }

    generateDepositMintTx(id: number) {
        return this.http.post<TransactionInfo>(`${this.endpoint}/${id}/transaction`, {});
    }
}

export interface DepositSearchResponse {
    deposit: Deposit;
    user: {
        uuid: string;
        email: string;
        first_name: string;
        last_name: string;
        enabled: boolean;
    };
}

interface Deposit {
    id: number;
    owner: string;
    reference: string;
    created_at: Date;
    created_by: string;
    type: string;
    approved_at?: any;
    amount: number;
    document_response?: {
        id: number;
        link: string;
        name: string;
        type: string;
        size: number;
        created_at: Date;
    };
    tx_hash?: string;
    declined_at?: Date;
    declined_comment?: string;
}

interface DepositListResponse {
    deposits: DepositSearchResponse[];
    page: number;
    total_pages: number;
}

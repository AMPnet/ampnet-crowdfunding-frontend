import { Injectable } from '@angular/core';
import { BackendHttpClient } from './backend-http-client.service';
import { CreateWalletBankAccountData } from './wallet/platform-bank-account.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    endpoint = '/api/user/bank-account';

    constructor(private http: BackendHttpClient) {
    }

    getMyBankAccounts() {
        return this.http.get<UserBankAccountsRes>(this.endpoint);
    }

    createBankAccount(data: CreateWalletBankAccountData) {
        return this.http.post<UserBankAccount>(this.endpoint, data);
    }

    deleteBankAccount(id: number) {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}

export interface UserBankAccount {
    id: number;
    iban: string;
    bank_code: string;
    created_at: Date;
    alias: string;
    bank_name: string;
    bank_address: string;
    beneficiary_name: string;
}

interface UserBankAccountsRes {
    bank_accounts: UserBankAccount[];
}

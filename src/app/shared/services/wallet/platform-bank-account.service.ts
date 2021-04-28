import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class PlatformBankAccountService {
    endpoint = '/api/wallet/bank-account';

    constructor(private http: BackendHttpClient) {
    }

    bankAccounts$ = this.http.get<WalletBankAccountsRes>(this.endpoint);

    createBankAccount(data: CreateWalletBankAccountData) {
        return this.http.post<PlatformBankAccount>(this.endpoint, data);
    }

    deleteBankAccount(id: number) {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}

export interface PlatformBankAccount {
    id: number;
    iban: string;
    bank_code: string;
    alias: string;
    coop: string;
    bank_name: string;
    bank_address: string;
    beneficiary_name: string;
    beneficiary_address: string;
    beneficiary_city: string;
    beneficiary_country: string;
}

interface WalletBankAccountsRes {
    bank_accounts: PlatformBankAccount[];
}

export interface CreateWalletBankAccountData {
    iban: string;
    bank_code: string;
    alias?: string;
    bank_name?: string;
    bank_address?: string;
    beneficiary_name?: string;
    beneficiary_address?: string;
    beneficiary_city?: string;
    beneficiary_country?: string;
}

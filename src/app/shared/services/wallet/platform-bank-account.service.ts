import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { Observable } from 'rxjs';
import { CacheService } from '../cache.service';

@Injectable({
    providedIn: 'root'
})
export class PlatformBankAccountService {
    endpoint = '/api/wallet/bank-account';

    constructor(private http: BackendHttpClient,
                private cacheService: CacheService) {
    }

    bankAccounts$ = this.http.get<WalletBankAccountsRes>(this.endpoint);

    createBankAccount(iban: String, bankCode: String, alias: String) {
        return this.http.post<PlatformBankAccount>(this.endpoint,
            <CreateWalletBankAccountData>{
                iban: iban,
                bank_code: bankCode,
                alias: alias
            });
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
}

interface WalletBankAccountsRes {
    bank_accounts: PlatformBankAccount[];
}

interface CreateWalletBankAccountData {
    iban: string;
    bank_code: string;
    alias: string;
}

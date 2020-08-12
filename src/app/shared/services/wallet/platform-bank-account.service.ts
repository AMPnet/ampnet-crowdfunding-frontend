import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class PlatformBankAccountService {
    endpoint = '/api/wallet/bank-account';

    constructor(private http: BackendApiService) {
    }

    getBankAccounts() {
        return this.http.get<WalletBankAccountsRes>(this.endpoint);
    }

    createBankAccount(iban: String, bankCode: String, alias: String) {
        return this.http.post<BankAccount>(this.endpoint,
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

interface BankAccount {
    id: number;
    iban: string;
    bank_code: string;
    alias: string;
}

interface WalletBankAccountsRes {
    bank_accounts: BankAccount[];
}

interface CreateWalletBankAccountData {
    iban: string;
    bank_code: string;
    alias: string;
}

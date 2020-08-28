import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../user-status-storage';
import { BackendHttpClient } from './backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    endpoint = '/api/user/bank-account';

    constructor(private http: BackendHttpClient) {
    }

    getMyBankAccounts() {
        const bankData = this.http.get<UserBankAccountsRes>(this.endpoint);
        bankData.subscribe(res => {
            UserStatusStorage.bankData = res.bank_accounts;
        });
        return bankData;
    }

    createBankAccount(iban: String, bankCode: String, alias: String) {
        return this.http.post<UserBankAccount>(this.endpoint,
            <CreateUserBankAccountData>{
                iban: iban,
                bank_code: bankCode,
                alias: alias
            });
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
}

interface UserBankAccountsRes {
    bank_accounts: UserBankAccount[];
}

interface CreateUserBankAccountData {
    iban: string;
    bank_code: string;
    alias: string;
}

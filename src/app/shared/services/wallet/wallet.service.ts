import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendHttpClient } from '../backend-http-client.service';
import { TransactionInfo, WalletDetails } from './wallet-cooperative/wallet-cooperative-wallet.service';
import { tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    walletChange$: Observable<WalletDetails | null>;

    private walletChangeSubject = new ReplaySubject<WalletDetails | null>(1);

    constructor(private http: BackendHttpClient) {
        this.walletChange$ = this.walletChangeSubject.asObservable();
    }

    initWallet(address: string) {
        return this.http.post<WalletDetails>('/api/wallet/wallet',
            <InitWalletData>{
                public_key: address
            }).pipe(this.tapWalletChange.bind(this));
    }

    getUserWallet() {
        return this.http.get<WalletDetails>('/api/wallet/wallet')
            .pipe(this.tapWalletChange.bind(this));
    }

    private tapWalletChange(source: Observable<WalletDetails>) {
        return source.pipe(
            tap(wallet => {
                UserStatusStorage.walletData = wallet;
                this.walletChangeSubject.next(wallet);
            }, err => {
                this.walletChangeSubject.next(null);
            })
        );
    }

    getInfoFromPairingCode(pairingCode: string) {
        return this.http.get<WalletPairInfo>(`/api/wallet/wallet/pair/${pairingCode}`);
    }

    investToProject(projectID: string, investAmount: number) {
        return this.http.post<TransactionInfo>(`/api/wallet/invest/project/${projectID}`, {
            amount: investAmount.toString()
        });
    }

    getProjectWallet(projectID: number | string) {
        return this.http.get<WalletDetails>(`/api/wallet/public/wallet/project/${projectID}`);
    }

    getOrganizationWallet(orgID: string) {
        return this.http.get<WalletDetails>(`/api/wallet/wallet/organization/${orgID}`);
    }

    createProjectWalletTransaction(projectID: string) {
        return this.http.get<TransactionInfo>(`/api/wallet/wallet/project/${projectID}/transaction`);
    }

    createOrganizationWalletTransaction(orgID: string) {
        return this.http.get<TransactionInfo>(`/api/wallet/wallet/organization/${orgID}/transaction`);
    }

    getTransactionHistory() {
        return this.http.get<UserTransactionResponse>('/api/wallet/portfolio/transactions');
    }
}

interface InitWalletData {
    public_key: string;
}

interface WalletPairInfo {
    code: string;
    public_key: string;
}

export interface UserTransaction {
    from_tx_hash: string;
    to_tx_hash: string;
    amount: number;
    type: string;
    date: Date;
    state: string;
}

interface UserTransactionResponse {
    transactions: UserTransaction[];
}

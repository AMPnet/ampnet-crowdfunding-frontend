import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendHttpClient } from '../backend-http-client.service';
import { TransactionInfo, WalletDetails } from './wallet-cooperative/wallet-cooperative-wallet.service';
import { catchError, retry, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, empty, merge, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { CacheService } from '../cache.service';
import { log } from 'util';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private cacheKey = 'user_wallet';

    private changeWalletSubject = new ReplaySubject<WalletDetails>(1);
    private refreshWalletSubject = new BehaviorSubject<void>(null);

    wallet$ = merge(
        this.changeWalletSubject.pipe(switchMap(wallet => of(wallet))),
        this.refreshWalletSubject.pipe(
            switchMap(() => this.cacheService.setAndGet(this.cacheKey, this.getUserWallet(), 60_000)))
    ).pipe(catchError(() => EMPTY));

    constructor(private http: BackendHttpClient,
                private cacheService: CacheService) {
    }

    initWallet(address: string) {
        return this.http.post<WalletDetails>('/api/wallet/wallet',
            <InitWalletData>{
                public_key: address
            }).pipe(this.tapWalletChange(this));
    }

    getUserWallet() {
        const self = this;
        return this.http.get<WalletDetails | WalletState>('/api/wallet/wallet').pipe(
            self.tapWalletChange(self),
            retry(3),
            catchError(err => err.status === 404 ? of(WalletState.EMPTY) : throwError(err))
        );
    }

    setWallet(wallet: WalletDetails) {
        this.changeWalletSubject.next(wallet);
    }

    clearAndRefreshWallet() {
        this.cacheService.clear(this.cacheKey);
        this.refreshWallet();
    }

    refreshWallet() {
        this.refreshWalletSubject.next();
    }

    private tapWalletChange(self: WalletService) {
        return function (source: Observable<WalletDetails>) {
            return source.pipe(
                tap(wallet => {
                    UserStatusStorage.walletData = wallet;
                    self.changeWalletSubject.next(wallet);
                })
            );
        };
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

export enum WalletState {
    EMPTY,
}

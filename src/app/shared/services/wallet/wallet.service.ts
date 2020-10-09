import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { TransactionInfo, WalletDetails } from './wallet-cooperative/wallet-cooperative-wallet.service';
import { catchError, retry, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, merge, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { CacheService } from '../cache.service';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private cacheKey = 'user_wallet';

    private changeWalletSubject = new ReplaySubject<WalletDetailsWithState>(1);
    private refreshWalletSubject = new BehaviorSubject<void>(null);

    wallet$ = merge(
        this.changeWalletSubject.pipe(switchMap(wallet => of(wallet))),
        this.refreshWalletSubject.pipe(
            switchMap(() => this.cacheService.setAndGet(this.cacheKey, this.getUserWallet(), 30_000)))
    ).pipe(
        catchError(() => EMPTY)
    );

    constructor(private http: BackendHttpClient,
                private cacheService: CacheService) {
    }

    initWallet(address: string) {
        return this.http.post<WalletDetails>('/api/wallet/wallet',
            <InitWalletData>{
                public_key: address
            }).pipe(tap(() => this.clearAndRefreshWallet()));
    }

    getUserWallet(): Observable<WalletDetailsWithState> {
        return this.getFreshUserWallet().pipe(
            switchMap(wallet => {
                const walletState = wallet.hash !== null ? WalletState.READY : WalletState.NOT_VERIFIED;
                return of({state: walletState, wallet: wallet});
            }),
            catchError(err => {
                switch (err.status) {
                    case 404:
                    case 409:
                        return of({state: WalletState.EMPTY});
                    default:
                        return throwError(err);
                }
            }),
            tap(wallet => this.changeWalletSubject.next(wallet)),
            retry(3),
        );
    }

    getFreshUserWallet() {
        return this.http.get<WalletDetails>('/api/wallet/wallet');
    }

    setWallet(wallet: WalletDetailsWithState) {
        this.changeWalletSubject.next(wallet);
    }

    clearAndRefreshWallet() {
        this.cacheService.clear(this.cacheKey);
        this.refreshWallet();
    }

    refreshWallet() {
        this.refreshWalletSubject.next();
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
    amount: number;
    date: Date;
    description: string;
    from: string;
    from_tx_hash: string;
    state: TransactionState;
    to: string;
    to_tx_hash: string;
    type: TransactionType;
}

interface UserTransactionResponse {
    transactions: UserTransaction[];
}

export enum WalletState {
    EMPTY,
    NOT_VERIFIED,
    READY,
}

export interface WalletDetailsWithState {
    wallet?: WalletDetails;
    state: WalletState;
}

export enum TransactionType {
    INVEST = 'INVEST',
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
    SHARE_PAYOUT = 'SHARE_PAYOUT',
    CANCEL_INVESTMENT = 'CANCEL_INVESTMENT',
    APPROVE_INVESTMENT = 'APPROVE_INVESTMENT',
    UNRECOGNIZED = 'UNRECOGNIZED' // TODO: Remove UNRECOGNIZED when renamed on backend.
}

export enum TransactionState {
    MINED = 'MINED',
    PENDING = 'PENDING',
    FAILED = 'FAILED'
}

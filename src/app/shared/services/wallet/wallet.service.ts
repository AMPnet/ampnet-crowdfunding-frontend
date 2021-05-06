import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
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
        return this.http.post<Wallet>('/api/wallet/wallet',
            <InitWalletData>{
                public_key: address
            }).pipe(tap(() => this.clearAndRefreshWallet()));
    }

    getUserWallet(): Observable<WalletDetailsWithState> {
        return this.getFreshUserWallet().pipe(
            switchMap(wallet => {
                // Javascript beauty. Because `null >= 0` returns `true`, FFS!
                // https://stackoverflow.com/questions/2910495/why-null-0-null-0-but-not-null-0
                const walletState = wallet.hash !== null && (wallet.balance === 0 || wallet.balance > 0) ?
                    WalletState.READY : WalletState.NOT_VERIFIED;
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
        return this.http.get<Wallet>('/api/wallet/wallet');
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
        return this.http.get<Wallet>(`/api/wallet/public/wallet/project/${projectID}`);
    }

    getOrganizationWallet(orgID: string) {
        return this.http.get<Wallet>(`/api/wallet/wallet/organization/${orgID}`);
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

export interface TransactionInfo {
    tx: string;
    tx_id: number;
    info: {
        tx_type: string;
        title: string;
        description: string;
    };
}

export interface UserTransaction {
    tx_hash: string; // Identifier
    from_tx_hash: string;
    to_tx_hash: string;
    amount: number;
    date: Date;
    description: string;
    from: string;
    to: string;
    state: TransactionState;
    type: TransactionType;
    share: string;
}

interface UserTransactionResponse {
    transactions: UserTransaction[];
}

export enum WalletState {
    EMPTY = 'EMPTY',
    NOT_VERIFIED = 'NOT_VERIFIED',
    READY = 'READY',
}

export interface WalletDetailsWithState {
    wallet?: Wallet;
    state: WalletState;
}

export interface Wallet {
    uuid: string;
    activation_data: string;
    type: string;
    currency: string;
    created_at: Date;
    hash?: any;
    activated_at?: any;
    alias?: any;
    balance?: any;
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

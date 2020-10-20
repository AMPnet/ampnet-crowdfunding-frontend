import { Injectable } from '@angular/core';
import {
    ArkaneConnect,
    PopupResult,
    Profile,
    SecretType,
    SignatureRequestType,
    SignerResult,
    Wallet,
    WindowMode
} from '@arkane-network/arkane-connect';
import { combineLatest, from, Observable, of, throwError } from 'rxjs';
import { Account } from '@arkane-network/arkane-connect/dist/src/models/Account';
import { catchError, find, map, switchMap, take, tap, timeout } from 'rxjs/operators';
import { WalletService, WalletState } from './wallet/wallet.service';
import { PopupService } from './popup.service';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { BroadcastService } from './broadcast.service';
import { TransactionInfo } from './wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class ArkaneService {

    constructor(private walletService: WalletService,
                private broadcastService: BroadcastService,
                private popupService: PopupService) {
    }

    secretType = SecretType.AETERNITY;
    arkaneConnect = new ArkaneConnect('AMPnet', { // TODO: Extract to environment
        environment: 'staging', // TODO: Extract to environment
    });

    private static throwError(reason: ArkaneError): Observable<never> {
        return throwError({error: 'ARKANE_SERVICE_ERROR', message: reason});
    }

    getMatchedWallet(): Observable<Wallet> {
        return combineLatest([this.getUserWalletAddress(), this.getWallets()]).pipe(
            switchMap(([userWalletAddress, wallets]) => {
                return userWalletAddress === null ?
                    this.arkaneWalletNotInitializedProcedure(wallets) :
                    this.arkaneWalletInitializedProcedure(userWalletAddress, wallets);
            })
        );
    }

    private getUserWalletAddress(): Observable<string> {
        return combineLatest([this.walletService.wallet$]).pipe(
            map(([wallet]) => wallet), take(1),
            map(wallet => wallet?.state !== WalletState.EMPTY ? wallet.wallet.activation_data : null)
        );
    }

    private arkaneWalletInitializedProcedure(userWalletAddress: string, wallets: Wallet[]) {
        return of(...wallets).pipe(
            find(w => w.address === userWalletAddress),
            switchMap(wallet => wallet !== undefined ? of(wallet) : this.arkaneWrongAccountProcedure())
        );
    }

    private arkaneWalletNotInitializedProcedure(wallets: Wallet[]): Observable<Wallet> {
        return of(wallets.length === 0).pipe(
            switchMap(noWallets => noWallets ?
                this.arkaneNoWalletsAvailableProcedure() :
                this.tryToInitWalletProcedure(wallets))
        );
    }

    private tryToInitWalletProcedure(wallets: Wallet[]): Observable<Wallet> {
        return of(...wallets).pipe(
            switchMap(wallet => this.walletService.initWallet(wallet.address).pipe(
                map(res => res.activation_data),
                catchError(err => err.error?.err_code === '0504' ? of(null) : throwError(err))
            )),
            find(value => value !== null),
            switchMap(newWalletAddress => newWalletAddress !== undefined ?
                this.getMatchedWallet().pipe(tap(() => this.walletService.clearAndRefreshWallet())) :
                this.arkaneWalletsAlreadyInUseProcedure()
            )
        );
    }

    private arkaneWalletsAlreadyInUseProcedure(): Observable<Wallet> {
        return this.popupService.info('Your wallets on Arkane are already in use. Please create a new wallet.').pipe(
            switchMap(popupRes => popupRes.dismiss === undefined ?
                this.manageWalletsFlow() : ArkaneService.throwError(ArkaneError.CREATE_WALLET_POPUP_DISMISSED)),
            switchMap(() => this.getMatchedWallet())
        );
    }

    private arkaneNoWalletsAvailableProcedure(): Observable<Wallet> {
        return this.popupService.info('You will be prompted to create a new wallet on Arkane.').pipe(
            switchMap(popupRes => popupRes.dismiss === undefined ?
                this.manageWalletsFlow() : ArkaneService.throwError(ArkaneError.NO_WALLETS_POPUP_DISMISSED)),
            switchMap(() => this.getMatchedWallet())
        );
    }

    private arkaneWrongAccountProcedure(): Observable<Wallet> {
        return this.logout().pipe(
            switchMap(() => this.popupService.info(
                'You are logged in with wrong Arkane account. You will be logged out.',
                'If this message appears multiple times, go to ' +
                '<a href="https://arkane.network" target="_blank" style="display: contents">Arkane Network</a> website, ' +
                'click on profile icon in upper-right corner, click logout and come back here.'
            )),
            switchMap(popupRes => popupRes.dismiss === undefined ?
                this.getAccountFlow() : ArkaneService.throwError(ArkaneError.WRONG_ACCOUNT_POPUP_DISMISSED)),
            switchMap(account => account.isAuthenticated ?
                this.getMatchedWallet() : ArkaneService.throwError(ArkaneError.USER_NOT_AUTHENTICATED))
        );
    }

    getProfile(): Observable<Profile> {
        return this.ensureAuthenticated().pipe(
            switchMap(() => from(this.arkaneConnect.api.getProfile())),
        );
    }

    getWallets(): Observable<Wallet[]> {
        return this.ensureAuthenticated().pipe(
            switchMap(() => from(this.arkaneConnect.api.getWallets({secretType: this.secretType}))),
        );
    }

    signAndBroadcastTx(txInfo: TransactionInfo) {
        return this.signTransaction(txInfo.tx).pipe(
            switchMap((arkaneRes) =>
                this.broadcastService.broadcastSignedTx(arkaneRes.result.signedTransaction, txInfo.tx_id)
                    .pipe(displayBackendErrorRx())),
        );
    }

    private signTransaction(txToSign: Observable<string> | string): Observable<SignerResult> {
        return this.getMatchedWallet().pipe(
            switchMap(wallet => combineLatest([of(wallet), txToSign instanceof Observable ? txToSign : of(txToSign)])),
            switchMap(([wallet, txDataToSign]) =>
                from(this.arkaneConnect.createSigner(WindowMode.POPUP).sign({
                    walletId: wallet.id,
                    data: txDataToSign,
                    type: SignatureRequestType.AETERNITY_RAW
                })).pipe(switchMap(signingResult => {
                    switch (signingResult.status) {
                        case 'ABORTED':
                            return ArkaneService.throwError(ArkaneError.SIGNING_ABORTED);
                        case 'FAILED':
                            return ArkaneService.throwError(ArkaneError.SIGNING_FAILED);
                        case 'SUCCESS':
                            return of(signingResult);
                    }
                }))
            ));
    }

    logout(): Observable<void> {
        return from(this.arkaneConnect.logout());
    }

    getAccountFlow(): Observable<Account> {
        return from(this.arkaneConnect.flows.getAccount(this.secretType)).pipe(
            switchMap(res => res.auth === undefined ?
                ArkaneService.throwError(ArkaneError.GET_ACCOUNT_FLOW_INTERRUPTED) : of(res))
        );
    }

    manageWalletsFlow(): Observable<void | PopupResult> {
        return from(this.arkaneConnect.flows.manageWallets(this.secretType)).pipe(
            switchMap(res => {
                if (!res) {
                    return ArkaneService.throwError(ArkaneError.MANAGE_WALLETS_FAILED);
                }

                switch (res.status) {
                    case 'ABORTED':
                        return ArkaneService.throwError(ArkaneError.MANAGE_WALLETS_ABORTED);
                    case 'FAILED':
                        return ArkaneService.throwError(ArkaneError.MANAGE_WALLETS_FAILED);
                    case 'SUCCESS':
                        return of(res);
                }
            })
        );
    }

    // on Chrome (Brave) returns infinite loop of warnings in browser console.
    // After arkaneConnect.flows.getAccount, method does not ever respond back and gets stuck
    // in an endless loop.
    isAuthenticated(): Observable<boolean> {
        return from(this.arkaneConnect.checkAuthenticated().then(res => res.isAuthenticated)).pipe(
            timeout(10000),
        );
    }

    isAuthenticatedByWallets(): Observable<boolean> {
        return from(this.arkaneConnect.api.getWallets({secretType: this.secretType})).pipe(
            catchError(() => of(null)),
            map(wallet => wallet !== null),
        );
    }

    private ensureAuthenticated(): Observable<void> {
        // TODO: set isAuthenticated() when arkaneConnect.checkAuthenticated() will work properly.
        return this.isAuthenticatedByWallets().pipe(
            switchMap(signedIn => !signedIn ?
                this.getAccountFlow().pipe(map(account => account.isAuthenticated)) : of(signedIn)),
            switchMap(signedIn => signedIn ?
                of(null) : ArkaneService.throwError(ArkaneError.USER_NOT_AUTHENTICATED))
        );
    }
}

enum ArkaneError {
    GET_ACCOUNT_FLOW_INTERRUPTED = 'GetAccountFlow interrupted.',
    USER_NOT_AUTHENTICATED = 'User not authenticated.',
    SIGNING_ABORTED = 'Transaction signing aborted.',
    SIGNING_FAILED = 'Transaction signing failed.',
    NO_WALLETS_POPUP_DISMISSED = 'User dismissed no wallets popup',
    WRONG_ACCOUNT_POPUP_DISMISSED = 'User dismissed wrong account popup',
    CREATE_WALLET_POPUP_DISMISSED = 'User dismissed create new wallet popup',
    MANAGE_WALLETS_ABORTED = 'Manage wallets aborted.',
    MANAGE_WALLETS_FAILED = 'Manage wallets failed.',
}

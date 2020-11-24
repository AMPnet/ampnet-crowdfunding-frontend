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
import { catchError, concatMap, find, map, switchMap, take, takeWhile, tap, timeout } from 'rxjs/operators';
import { TransactionInfo, WalletService, WalletState } from './wallet/wallet.service';
import { PopupService } from './popup.service';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { BroadcastService } from './broadcast.service';
import { AppConfigService } from './app-config.service';

@Injectable({
    providedIn: 'root'
})
export class ArkaneService {
    private arkaneConnect: ArkaneConnect;
    private secretType = SecretType.AETERNITY;

    constructor(private walletService: WalletService,
                private appConfigService: AppConfigService,
                private broadcastService: BroadcastService,
                private popupService: PopupService) {
        this.appConfigService.config$.subscribe(config => {
            const arkaneConfig = config.config.arkane;
            this.arkaneConnect = new ArkaneConnect(arkaneConfig.id, {
                environment: arkaneConfig.env,
            });
        });
    }

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
            concatMap(wallet => this.walletService.initWallet(wallet.address).pipe(
                map(res => res.activation_data),
                catchError(err => err.error?.err_code === '0504' ? of(null) : throwError(err)),
                displayBackendErrorRx()
            )),
            takeWhile(x => x === null, true),
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
            switchMap(() => this.popupService.info('You are logged in with wrong Arkane account. You will be logged out.')),
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

    // Method returns infinite loop of warnings in browser console.
    // It turned out that this occurs when some browsers block 3rd-party cookies.
    // This should be handled on Arkane side in the future.
    isAuthenticated(): Observable<boolean> {
        return from(this.arkaneConnect.checkAuthenticated())
            .pipe(map(res => res.isAuthenticated))
            .pipe(
                timeout(10000),
                catchError(() => this.popupService.new({
                        type: 'error',
                        title: 'Arkane authentication failed.',
                        text: 'This might be caused by blocking 3rd-party cookies in your browser. ' +
                            'Consider unblocking them to proceed.',
                        customClass: 'popup-error',
                        position: 'top'
                    }).pipe(switchMap(() =>
                        ArkaneService.throwError(ArkaneError.USER_NOT_AUTHENTICATED)))
                )
            );
    }

    private ensureAuthenticated(): Observable<void> {
        return this.isAuthenticated().pipe(
            switchMap(signedIn => !signedIn ?
                this.getAccountFlow().pipe(map(account => account.isAuthenticated)) : of(signedIn)),
            switchMap(signedIn => signedIn ?
                of(null) : ArkaneService.throwError(ArkaneError.USER_NOT_AUTHENTICATED))
        );
    }
}

enum ArkaneError {
    GET_ACCOUNT_FLOW_INTERRUPTED = 'GET_ACCOUNT_FLOW_INTERRUPTED',
    USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED',
    SIGNING_ABORTED = 'SIGNING_ABORTED',
    SIGNING_FAILED = 'SIGNING_FAILED',
    NO_WALLETS_POPUP_DISMISSED = 'NO_WALLETS_POPUP_DISMISSED',
    WRONG_ACCOUNT_POPUP_DISMISSED = 'WRONG_ACCOUNT_POPUP_DISMISSED',
    CREATE_WALLET_POPUP_DISMISSED = 'CREATE_WALLET_POPUP_DISMISSED',
    MANAGE_WALLETS_ABORTED = 'MANAGE_WALLETS_ABORTED',
    MANAGE_WALLETS_FAILED = 'MANAGE_WALLETS_FAILED',
}

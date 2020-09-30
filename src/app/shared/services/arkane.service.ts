import { Injectable } from '@angular/core';
import { ArkaneConnect, SecretType, SignatureRequestType, Wallet, WindowMode } from '@arkane-network/arkane-connect';
import { combineLatest, from, Observable, of } from 'rxjs';
import { Account } from '@arkane-network/arkane-connect/dist/src/models/Account';
import { catchError, find, map, switchMap, takeLast, tap, timeout } from 'rxjs/operators';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { WalletService } from './wallet/wallet.service';
import { PopupService } from './popup.service';

@Injectable({
    providedIn: 'root'
})
export class ArkaneService {
    arkaneConnect = new ArkaneConnect('AMPnet', {
        environment: 'staging',
    });
    secretType = SecretType.AETERNITY;

    constructor(private walletService: WalletService,
                private popupService: PopupService) {
    }


    getMatchedWallet() {
        return combineLatest([this.getWalletAddress(), this.getWallets()]).pipe(
            switchMap(async ([walletAddress, wallets]) => {
                if (walletAddress === null) { // Wallet not initialized.
                    if (wallets.length === 0) { // No wallet on Arkane, needs to create one.

                    } else {
                        const newWalletAddress = await of(...wallets).pipe(
                            switchMap(wallet => this.walletService.initWallet(wallet.address).pipe(
                                map(res => res.activation_data),
                                catchError(_ => null)
                            )),
                            find(value => value !== null)
                        ).toPromise();

                        if (newWalletAddress === undefined) { // Wallets on arkane already in use, needs to create one.

                        }
                    }
                }

                // const wallet = wallets.filter(w => w.address === walletAddress)[0];
            })
        );
    }

    private getWalletAddress(): Observable<string> {
        return this.walletService.wallet$.pipe(
            takeLast(1), map(wallet => wallet !== null ? wallet.wallet.activation_data : null)
        );
    }


    // DO NOT call this method if user is not authenticated because you will
    // probably get CORS error.
    getProfile() {
        return this.ensureAuthenticated(from(this.arkaneConnect.api.getProfile())).pipe(
            catchError(() => of(null)),
            tap(profile => console.log('getProfile', profile))
        );
    }

    getWallets(): Observable<Wallet[]> {
        return this.ensureAuthenticated(from(this.arkaneConnect.api.getWallets({secretType: this.secretType}))).pipe(
            catchError(() => of(null)),
            tap(wallets => console.log('getWallets', wallets))
        );
    }

    signTransaction(walletID: string, txToSign: string) {
        SpinnerUtil.showSpinner();
        return this.ensureAuthenticated(
            from(this.arkaneConnect.createSigner(WindowMode.POPUP).sign({
                walletId: account.wallets[0].id,
                data: res.tx,
                type: SignatureRequestType.AETERNITY_RAW
            }))
        );
    }

    logout(): Observable<void> {
        return from(this.arkaneConnect.logout()).pipe(
            tap(() => console.log('logout'))
        );
    }

    getAccountFlow(): Observable<Account> {
        return from(this.arkaneConnect.flows.getAccount(this.secretType, {})).pipe(
            tap(console.log)
        );
    }

    // on Chrome (Brave) returns infinite loop of warnings in browser console.
    // After arkaneConnect.flows.getAccount, method does not ever respond back and gets stuck
    // in an endless loop.
    isAuthenticated(): Observable<boolean> {
        return from(this.arkaneConnect.checkAuthenticated().then(res => res.isAuthenticated)).pipe(
            timeout(10000),
            tap(isAuthenticated => console.log('isAuthenticated', isAuthenticated))
        );
    }

    // TODO: Uncomment when arkaneConnect.checkAuthenticated() will work properly
    // private ensureAuthenticated = <T>(outcome: Observable<T>): Observable<T> =>
    //     this.isAuthenticated().pipe(
    //         switchMap(signedIn => !signedIn ? this.getAccountFlow().pipe(map(account => account.isAuthenticated)) : of(signedIn)),
    //         switchMap(signedIn => signedIn ? from(outcome) : throwError('User not authenticated.'))
    //     )

    private ensureAuthenticated = <T>(outcome: Observable<T>): Observable<T> => {
        return from(outcome);
    };
}

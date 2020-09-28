import { Injectable } from '@angular/core';
import { ArkaneConnect, SecretType, Wallet } from '@arkane-network/arkane-connect';
import { from, Observable, of, throwError } from 'rxjs';
import { Account } from '@arkane-network/arkane-connect/dist/src/models/Account';
import { catchError, map, switchMap, tap, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ArkaneService {
    arkaneConnect = new ArkaneConnect('AMPnet', {
        environment: 'staging',
    });
    secretType = SecretType.AETERNITY;

    constructor() {
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

    createWallet() {

    }

    logout(): Observable<void> {
        return from(this.arkaneConnect.logout()).pipe(
            tap(() => console.log('logout'))
        );
    }

    private getAccountFlow(): Observable<Account> {
        return from(this.arkaneConnect.flows.getAccount(this.secretType)).pipe(
            tap(console.log)
        );
    }

    // on Chrome (Brave) returns infinite loop of warnings in browser console.
    // After arkaneConnect.flows.getAccount, method does not ever respond back and gets stuck
    // in an endless loop.
    private isAuthenticated(): Observable<boolean> {
        return from(this.arkaneConnect.checkAuthenticated().then(res => res.isAuthenticated)).pipe(
            timeout(10000),
            tap(isAuthenticated => console.log('isAuthenticated', isAuthenticated))
        );
    }

    private ensureAuthenticated = <T>(outcome: Observable<T>): Observable<T> =>
        this.isAuthenticated().pipe(
            switchMap(signedIn => !signedIn ? this.getAccountFlow().pipe(map(account => account.isAuthenticated)) : of(signedIn)),
            switchMap(signedIn => signedIn ? from(outcome) : throwError('User not authenticated.'))
        )
}

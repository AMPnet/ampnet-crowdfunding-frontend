import { Injectable } from '@angular/core';
import { ArkaneConnect, SecretType, Wallet } from '@arkane-network/arkane-connect';
import { from, Observable, of } from 'rxjs';
import { Account } from '@arkane-network/arkane-connect/dist/src/models/Account';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { ConfirmationRequestType } from '@arkane-network/arkane-connect/dist/src/models/ConfirmationRequestType';

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

    getAccountFlow(): Observable<Account> {
        return from(this.arkaneConnect.flows.getAccount(this.secretType)).pipe(
            tap(console.log)
        );
    }

    logout(): Observable<void> {
        return from(this.arkaneConnect.logout()).pipe(
            tap(console.log)
        );
    }

    // on Chrome returns infinite loop of warnings in browser console.
    // After flows.getAccount, method times
    isAuthenticated(): Observable<boolean> {
        return from(this.arkaneConnect.checkAuthenticated().then(res => res.isAuthenticated)).pipe(
            timeout(10000),
            tap(console.log)
        );
    }

    // DO NOT call this method if user is not authenticated because you will
    // probably get CORS error.
    getProfile() {
        return from(this.arkaneConnect.api.getProfile()).pipe(
            catchError(() => of(null)),
            tap(console.log)
        );
    }

    getWallets(): Observable<Wallet[]> {
        return from(this.arkaneConnect.api.getWallets({secretType: this.secretType})).pipe(
            catchError(() => of(null)),
            tap(console.log)
        );
    }

    createWallet() {
        const signer = this.arkaneConnect.createSigner();
        signer.confirm({
            confirmationRequestType: ConfirmationRequestType.CREATE_APPLICATION_WALLET
        }).then(res => {
            console.log(res);
        });

        return of([]);
        // return from(signer.confirm({
        //     confirmationRequestType: ConfirmationRequestType.CREATE_APPLICATION_WALLET
        // })).pipe(
        //     map(result => {
        //         switch (result.status) {
        //             case 'ABORTED':
        //             case 'FAILED':
        //                 console.log(`Status ${result.status}; Result: ${result.result}`);
        //                 return null;
        //             case 'SUCCESS':
        //                 return result.result;
        //         }
        //     }),
        //     tap(console.log)
        // );
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { TransactionList, WalletModel } from '../models/WalletModel';
import { UserStatusStorage } from '../user-status-storage';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WalletService {

    private endpoint = '/wallet/wallet';
    private transactionHistoryEndpoint = '/wallet/portfolio/transactions';

    constructor(private http: HttpClient) {
    }

    initWallet(address: string) {
        return this.http.post<WalletModel>(API.generateRoute(this.endpoint), {
            'public_key': address
        }, API.tokenHeaders());
    }

    getWallet() {
        return this.http.get<WalletModel>(API.generateRoute(this.endpoint), API.tokenHeaders())
            .pipe(
                tap(res => {
                    UserStatusStorage.walletData = res;
                })
            );
    }

    getInfoFromPairingCode(pairingCode: string) {
        return this.http.get(API.generateComplexRoute(this.endpoint, [
            'pair', pairingCode
        ]), API.tokenHeaders());
    }

    getTransactionHistory() {
        return this.http.get<TransactionList>(
            API.generateRoute(this.transactionHistoryEndpoint), API.tokenHeaders())
            .pipe(
                tap(res => {
                    UserStatusStorage.transactionData = res;
                })
            );
    }
}

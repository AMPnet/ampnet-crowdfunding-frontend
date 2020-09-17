import { Component, OnInit } from '@angular/core';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { centsToBaseCurrencyUnit, prettyCurrency } from '../utilities/currency-util';
import * as numeral from 'numeral';
import { ArkaneConnect, SecretType } from '@arkane-network/arkane-connect';
import { TransactionState, UserTransaction, WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
})
export class WalletComponent {
    arkaneConnect: ArkaneConnect;

    tablePage = 1;
    tablePageSize = 10;
    transactionItems = 0;
    transactionHistory: UserTransaction[] = [];
    transactionHistoryPage: UserTransaction[] = [];

    wallet$ = this.walletService.wallet$;

    walletState = WalletState;
    transactionState = TransactionState;

    refreshTransactionHistorySubject = new BehaviorSubject<void>(null);
    transactionHistory$ = this.refreshTransactionHistorySubject.pipe(
        switchMap(() => this.walletService.getTransactionHistory()),
        tap(res => {
            this.transactionHistory = res.transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            this.transactionItems = this.transactionHistory.length;
            this.refreshTransactionHistoryPage();
        }),
        tap(_ => {
            const pendingTransactionsCount = this.transactionHistory
                .filter(transaction => transaction.state === this.transactionState.PENDING).length;
            if (pendingTransactionsCount > 0) {
                timer(5_000).pipe(tap(() => {
                    this.refreshTransactionHistorySubject.next();
                })).subscribe();
            }
        })
    );

    constructor(private walletService: WalletService) {
    }

    setUpArkane() {
        this.arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
        this.arkaneConnect.flows.getAccount(SecretType.AETERNITY).then(acc => {
            if ((acc.wallets !== undefined) && (acc.wallets.length > 0)) {
                this.startWalletInit(acc.wallets[0].address);
            }
        });
    }

    startWalletInit(addr: string) {
        SpinnerUtil.showSpinner();
        this.walletService.initWallet(addr).subscribe(() => {
            SpinnerUtil.hideSpinner();
            this.walletService.clearAndRefreshWallet();
        }, err => {
            this.arkaneConnect.logout();
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    refreshTransactionHistoryPage() {
        this.transactionHistoryPage = this.transactionHistory
            .map((transaction, i) => ({id: i + 1, ...transaction}))
            .slice((this.tablePage - 1) * this.tablePageSize, (this.tablePage - 1) * this.tablePageSize + this.tablePageSize);
    }
}

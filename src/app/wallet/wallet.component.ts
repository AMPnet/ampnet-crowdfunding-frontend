import { Component } from '@angular/core';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { ArkaneConnect, SecretType } from '@arkane-network/arkane-connect';
import { TransactionState, TransactionType, UserTransaction, WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { BehaviorSubject, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

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

    refreshTransactionHistorySubject = new BehaviorSubject<'fromPending'>(null);
    transactionHistory$ = this.refreshTransactionHistorySubject.pipe(
        switchMap(refreshReason => {
            return this.walletService.getTransactionHistory().pipe(
                map(res => {
                    this.transactionHistory = res.transactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    this.transactionItems = this.transactionHistory.length;
                    this.refreshTransactionHistoryPage();

                    return {refreshReason, transactionHistory: this.transactionHistory} as {
                        refreshReason: 'fromPending',
                        transactionHistory: UserTransaction[]
                    };
                })
            );
        }),
        tap(({refreshReason, transactionHistory}) => {
            const pendingTransactionsCount = transactionHistory
                .filter(transaction => transaction.state === TransactionState.PENDING).length;
            if (pendingTransactionsCount > 0) {
                timer(5_000).subscribe(() => this.refreshTransactionHistorySubject.next('fromPending'));
            } else if (refreshReason === 'fromPending') {
                this.walletService.clearAndRefreshWallet();
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

    shouldShowTransaction(transaction: UserTransaction): boolean {
        return !(transaction.type === TransactionType.APPROVE_INVESTMENT
            && transaction.state !== TransactionState.PENDING);
    }
}

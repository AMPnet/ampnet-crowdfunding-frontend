import { Component, OnDestroy } from '@angular/core';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { ArkaneConnect, SecretType } from '@arkane-network/arkane-connect';
import { TransactionState, TransactionType, UserTransaction, WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { BehaviorSubject, timer } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { WebsocketService } from '../shared/services/websocket.service';
import { ArkaneService } from '../shared/services/arkane.service';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnDestroy {
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

            // TODO: uncomment if, for a long period of time, websocket mechanism doesn't work;
            //  remove if works.
            // if (pendingTransactionsCount > 0) {
            //     timer(10_000).subscribe(() => this.refreshTransactionHistorySubject.next('fromPending'));
            // }

            if (refreshReason === 'fromPending' && pendingTransactionsCount === 0) {
                this.walletService.clearAndRefreshWallet();
            }
        })
    );

    middlewareNotifier$ = this.wallet$.pipe(take(1), switchMap(wallet => {
        return this.websocketService.walletNotifier(wallet.wallet.activation_data);
    })).subscribe(() => this.refreshTransactionHistorySubject.next('fromPending'));

    constructor(private walletService: WalletService,
                public arkaneService: ArkaneService,
                private websocketService: WebsocketService) {
    }

    ngOnDestroy() {
        this.middlewareNotifier$.unsubscribe();
    }

    setUpArkane() {
        // this.arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
        //
        this.arkaneConnect.flows.getAccount(SecretType.AETERNITY).then(acc => {
            if ((acc.wallets !== undefined) && (acc.wallets.length > 0)) {
                this.startWalletInit(acc.wallets[0].address);
            }
        });
    }

    // testArkane() {
    //     // this.arkaneService.isAuthenticated().subscribe(res => {
    //     //     console.log(res);
    //     //
    //     //
    //     // });
    //
    //     this.arkaneService.getAccount().subscribe(account => {
    //         console.log(account);
    //     });
    //
    //     // this.arkaneService.getProfile();
    //
    // }

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
        // TODO: Remove UNRECOGNIZED when renamed on backend.
        return !([TransactionType.APPROVE_INVESTMENT, TransactionType.UNRECOGNIZED].includes(transaction.type)
            && transaction.state !== TransactionState.PENDING);
    }
}

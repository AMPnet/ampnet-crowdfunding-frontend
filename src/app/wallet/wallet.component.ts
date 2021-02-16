import { Component, OnDestroy } from '@angular/core';
import { TransactionState, TransactionType, UserTransaction, WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { WebsocketService } from '../shared/services/websocket.service';
import { ArkaneService } from '../shared/services/arkane.service';
import { ReportService } from '../shared/services/report/report.service';
import { ErrorService } from '../shared/services/error.service';
import { enterTrigger } from '../animations';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
    animations: [enterTrigger]
})
export class WalletComponent implements OnDestroy {
    tablePage = 1;
    tablePageSize = 10;
    transactionItems = 0;
    transactionHistory: UserTransaction[] = [];
    transactionHistoryPage: UserTransaction[] = [];

    wallet$ = this.walletService.wallet$;

    walletState = WalletState;
    transactionState = TransactionState;
    transactionType = TransactionType;

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

    middlewareNotifier$ = combineLatest([this.wallet$]).pipe(
        map(([latestWallet]) => latestWallet), take(1),
        switchMap(wallet => {
            return wallet.wallet !== undefined ? this.websocketService.walletNotifier(wallet.wallet?.activation_data) : EMPTY;
        })
    ).subscribe(() => this.refreshTransactionHistorySubject.next('fromPending'));

    constructor(private walletService: WalletService,
                public arkaneService: ArkaneService,
                private errorService: ErrorService,
                private reportService: ReportService,
                private websocketService: WebsocketService) {
    }

    ngOnDestroy() {
        this.middlewareNotifier$.unsubscribe();
    }

    setUpArkane() {
        return this.arkaneService.getMatchedWallet();
    }

    refreshTransactionHistoryPage() {
        this.transactionHistoryPage = this.transactionHistory
            .map((transaction, i) => ({id: i + 1, ...transaction}))
            .slice((this.tablePage - 1) * this.tablePageSize, (this.tablePage - 1) * this.tablePageSize + this.tablePageSize);
    }

    shouldShowTransaction(transaction: UserTransaction, transactions: UserTransaction[]): boolean {
        const isTransientTransaction = [TransactionType.APPROVE_INVESTMENT, TransactionType.UNRECOGNIZED].includes(transaction.type);
        return !(isTransientTransaction && (this.tablePage > 1 || transactions.map(t => t.tx_hash).indexOf(transaction.tx_hash) > 0));
    }

    downloadReport() {
        return this.reportService.userTransactions()
            .pipe(this.errorService.handleError);
    }

    downloadSingleReport(transaction: UserTransaction) {
        return () => {
            return this.reportService.singleUserTransaction(transaction)
                .pipe(this.errorService.handleError);
        };
    }

    getExplorerLink(txHash: string) {
        return this.arkaneService.getExplorerLink(txHash);
    }
}

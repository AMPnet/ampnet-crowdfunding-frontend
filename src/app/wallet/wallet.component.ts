import { Component, OnInit } from '@angular/core';
import { UserTransaction, WalletService } from '../shared/services/wallet/wallet.service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import { centsToBaseCurrencyUnit, prettyCurrency } from '../utilities/currency-util';
import * as numeral from 'numeral';
import { ArkaneConnect, SecretType } from '@arkane-network/arkane-connect';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { TopbarService } from '../shared/services/topbar.service';

declare var $: any;

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
    wallet: WalletDetails;
    checkComplete = false;
    arkaneConnect: ArkaneConnect;
    tablePage = 1;
    tablePageSize = 10;
    transactionItems = 0;
    transactionHistory: UserTransaction[] = [];
    transactionHistoryPage: UserTransaction[] = [];

    constructor(private walletService: WalletService,
                private topbarService: TopbarService) {
    }

    ngOnInit() {
        this.getUserWallet();
        this.getTransactionHistory();
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
            this.getUserWallet();
        }, err => {
            this.arkaneConnect.logout();
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
        this.topbarService.walletInInitProcess(true);
    }

    getUserWallet() {
        SpinnerUtil.showSpinner();
        /* This part is breaking, walletChange doesnt show data! */
        /* this.walletService.getUserWallet(); */
        this.walletService.getUserWallet().subscribe(res => {
            /* this.wallet.uuid = res.uuid;
            this.wallet.activation_data = res.activation_data;
            this.wallet.currency = prettyCurrency(res.currency);
            this.wallet.balance = numeral(centsToBaseCurrencyUnit(res.balance)).format('0,0');
            this.wallet.activated_at = res.activated_at;
            this.checkComplete = true; */
            console.log("test" + res);
            SpinnerUtil.hideSpinner();
        }, err => {
            SpinnerUtil.hideSpinner();
            this.checkComplete = true;
        });
    }

    getTransactionHistory() {
        SpinnerUtil.showSpinner();
        this.walletService.getTransactionHistory().subscribe(res => {
            this.transactionHistory = res.transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            this.transactionItems = this.transactionHistory.length;
            this.refreshTransactionHistory();
        });
    }

    refreshTransactionHistory() {
        this.transactionHistoryPage = this.transactionHistory
            .map((transaction, i) => ({id: i + 1, ...transaction}))
            .slice((this.tablePage - 1) * this.tablePageSize, (this.tablePage - 1) * this.tablePageSize + this.tablePageSize);
    }
}

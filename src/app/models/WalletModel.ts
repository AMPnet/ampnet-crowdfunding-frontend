export class WalletModel {
    id: number;
    balance: number;
    currency: string;
    hash: string;
    activated_at: string;
}

export interface Transaction {
    from_tx_hash: string;
    to_tx_hash: string;
    amount: number;
    type: string;
    date: Date;
    state: string;
}

export interface TransactionList {
    transactions: Transaction[];
}



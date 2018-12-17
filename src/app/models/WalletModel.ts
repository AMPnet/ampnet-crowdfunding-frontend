export class WalletModel {
    id: number;
    balance: number;
    currency: string;
    createdAt: TransactionModel;
    transactions: [TransactionModel];
}

export class TransactionModel {
    id: number;
    sender: string;
    receiver: string;
    amount: number;
    currency: string;
    type: string;
    txHash: string;
    timestamp: string;
}
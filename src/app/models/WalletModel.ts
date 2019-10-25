export class WalletModel {
    id: number;
    balance: number;
    currency: string;
    hash: string;
    activated_at: string;
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
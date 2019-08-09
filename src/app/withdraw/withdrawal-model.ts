export interface WithdrawalModel {
    id: number,
    user: string,
    amount: number,
    approved_tx_hash: string,
    approved_tx: string,
    burned_tx_hash: string,
    burned_by: string,
    bank_account: string,
    created_at: string
}
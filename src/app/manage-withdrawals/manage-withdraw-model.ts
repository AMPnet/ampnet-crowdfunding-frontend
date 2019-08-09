import { UserModel } from '../models/user-model'

export interface ManageWithdrawModel {
    id: number,
    user: UserModel,
    amount: number,
    approved_tx_hash: string,
    approved_at: string,
    burned_tx_hash: string,
    burned_at: string,
    burned_by: string,
    created_at: string,
    bank_account: string,
    user_wallet: string
}
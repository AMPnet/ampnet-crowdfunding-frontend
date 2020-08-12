import { UserModel } from './models/user-model';
import { UserBankAccount } from './shared/services/user/payment.service';
import { Wallet } from './wallet/wallet.service';

export class UserStatusStorage {
    static personalData: UserModel;
    static walletData: Wallet;
    static bankData: UserBankAccount[];
}

import { UserModel } from './models/user-model';
import { WalletModel } from './models/WalletModel';
import { PaymentModels } from './models/payment-model';

export class UserStatusStorage {
    static personalData: UserModel;
    static walletData: WalletModel;
    static bankData: PaymentModels;
}

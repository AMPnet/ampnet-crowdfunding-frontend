import { UserModel } from './models/user-model';
import { UserBankAccount } from './shared/services/payment.service';
import { WalletDetails } from './shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

export class UserStatusStorage {
    static personalData: UserModel;
    static walletData: WalletDetails;
    static bankData: UserBankAccount[];
}

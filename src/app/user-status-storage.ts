import { UserBankAccount } from './shared/services/payment.service';
import { WalletDetails } from './shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { User } from './shared/services/user/signup.service';

export class UserStatusStorage {
    static personalData: User;
    static walletData: WalletDetails;
    static bankData: UserBankAccount[];
}

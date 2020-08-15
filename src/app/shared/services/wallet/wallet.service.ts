import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendApiService } from '../backend-api.service';
import { WalletDetails, TransactionInfo } from './wallet-cooperative/wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private endpoint = '/api/wallet/wallet';

    constructor(private http: BackendApiService) {
    }

    initWallet(address: string) {
        return this.http.post<WalletDetails>(this.endpoint,
            <InitWalletData>{
                public_key: address
            });
    }

    getUserWallet() {
        const walletResponse = this.http.get<WalletDetails>(this.endpoint);
        walletResponse.subscribe((res) => UserStatusStorage.walletData = res);

        return walletResponse;
    }

    getInfoFromPairingCode(pairingCode: string) {
        return this.http.get<WalletPairInfo>(`${this.endpoint}/pair/${pairingCode}`);
    }

    createProjectWallet(projectID: string) {
        return this.http.get<TransactionInfo>(`/api/wallet/wallet/project/${projectID}/transaction`);
    }

    getProjectWallet(projectID: string) {
        return this.http.get<WalletDetails>(`/api/wallet/public/wallet/project/${projectID}`);
    }
}

interface InitWalletData {
    public_key: string;
}

interface WalletPairInfo {
    code: string;
    public_key: string;
}

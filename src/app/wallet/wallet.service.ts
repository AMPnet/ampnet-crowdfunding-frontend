import { Injectable } from '@angular/core';
import { API } from '../utilities/endpoint-manager';
import { UserStatusStorage } from '../user-status-storage';
import { BackendApiService } from '../shared/services/backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private endpoint = '/api/wallet/wallet';

    constructor(private http: BackendApiService) {
    }

    initWallet(address: string) {
        return this.http.post<Wallet>(API.generateRoute(this.endpoint),
            <InitWalletData>{
                public_key: address
            });
    }

    getWallet() {
        const walletResponse = this.http.get<Wallet>(API.generateRoute(this.endpoint));
        walletResponse.subscribe((res) => UserStatusStorage.walletData = res);

        return walletResponse;
    }

    getInfoFromPairingCode(pairingCode: string) {
        return this.http.get(`${this.endpoint}/pair/${pairingCode}`);
    }
}

interface InitWalletData {
    public_key: string;
}

export interface Wallet {
    id: number;
    balance: number;
    currency: string;
    hash: string;
    activated_at: string;
}

import { Injectable } from '@angular/core';
import { BackendApiService } from '../../backend-api.service';
import { TransactionInfo } from './wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WalletCooperativeOwnershipService {
    ownershipEndpoint = '/api/wallet/cooperative/wallet/transfer/transaction';

    constructor(private http: BackendApiService) {
    }

    executePlatformManagerTransaction(walletAddress: string) {
        return this.executeOwnershipChangeTransaction(walletAddress, OwnershipType.PLATFORM_MANAGER);
    }

    executeTokenIssuerTransaction(walletAddress: string) {
        return this.executeOwnershipChangeTransaction(walletAddress, OwnershipType.TOKEN_ISSUER);
    }

    private executeOwnershipChangeTransaction(walletAddress: string, type: string) {
        return this.http.post<TransactionInfo>(this.ownershipEndpoint,
            <OwnershipChangeTransactionData>{
                wallet_address: walletAddress,
                type: type
            });
    }
}

interface OwnershipChangeTransactionData {
    wallet_address: string;
    type: string;
}

enum OwnershipType {
    PLATFORM_MANAGER = 'PLATFORM_MANAGER',
    TOKEN_ISSUER = 'TOKEN_ISSUER'
}

import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class OwnershipService {
    ownershipEndpoint = '/api/wallet/cooperative/wallet/transfer/transaction';

    constructor(private http: BackendApiService) {
    }

    getPlatformManagerTransaction(walletAddress: string) {
        return this.getOwnershipChangeTransaction(walletAddress, OwnershipType.PLATFORM_MANAGER);
    }

    getTokenIssuerTransaction(walletAddress: string) {
        return this.getOwnershipChangeTransaction(walletAddress, OwnershipType.TOKEN_ISSUER);
    }

    private getOwnershipChangeTransaction(walletAddress: string, type: string) {
        return this.http.post<OwnershipChangeTransactionResponse>(this.ownershipEndpoint,
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

interface OwnershipChangeTransactionResponse {
    tx: string;
    tx_id: number;
    info: {
        tx_type: string;
        title: string;
        description: string;
    };
}

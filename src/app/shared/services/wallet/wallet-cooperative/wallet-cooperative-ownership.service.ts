import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../../backend-http-client.service';
import { TransactionInfo } from '../wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WalletCooperativeOwnershipService {
    ownershipEndpoint = '/api/wallet/cooperative/wallet/transfer/transaction';

    constructor(private http: BackendHttpClient) {
    }

    executePlatformManagerTX(userUUID: string) {
        return this.executeOwnershipChangeTransaction(userUUID, OwnershipType.PLATFORM_MANAGER);
    }

    executeTokenIssuerTX(userUUID: string) {
        return this.executeOwnershipChangeTransaction(userUUID, OwnershipType.TOKEN_ISSUER);
    }

    private executeOwnershipChangeTransaction(userUUID: string, type: OwnershipType) {
        return this.http.post<TransactionInfo>(this.ownershipEndpoint,
            <OwnershipChangeTransactionData>{
                user_uuid: userUUID,
                type: type
            });
    }
}

interface OwnershipChangeTransactionData {
    user_uuid: string;
    type: OwnershipType;
}

enum OwnershipType {
    PLATFORM_MANAGER = 'PLATFORM_MANAGER',
    TOKEN_ISSUER = 'TOKEN_ISSUER'
}

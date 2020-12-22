import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../../backend-http-client.service';
import { TransactionInfo } from '../wallet.service';
import { UserRole } from '../../user/signup.service';

@Injectable({
    providedIn: 'root'
})
export class WalletCooperativeOwnershipService {
    ownershipEndpoint = '/api/wallet/cooperative/wallet/transfer/transaction';

    constructor(private http: BackendHttpClient) {
    }

    executeOwnershipChangeTransaction(userUUID: string, role: UserRole.PLATFORM_MANAGER | UserRole.TOKEN_ISSUER) {
        return this.http.post<TransactionInfo>(this.ownershipEndpoint,
            <OwnershipChangeTransactionData>{
                user_uuid: userUUID,
                type: role
            });
    }
}

interface OwnershipChangeTransactionData {
    user_uuid: string;
    type: UserRole.PLATFORM_MANAGER | UserRole.TOKEN_ISSUER;
}

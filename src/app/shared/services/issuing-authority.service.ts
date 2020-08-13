import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';

//
@Injectable({
    providedIn: 'root'
})
export class IssuingAuthorityService {
    issuerAddress = '0xC2500930248218f80187f07630A155F675c93930';
    endpoint = '/issuer';

    constructor(private http: BackendApiService) {
    }

    mintTokens(amount: number, userUUID: string) {
        return this.tokenIssuingCall(amount, userUUID, TokenAction.MINT);
    }

    burnTokens(amount: number, userUUID: string) {
        return this.tokenIssuingCall(amount, userUUID, TokenAction.BURN);
    }

    private tokenIssuingCall(amount: number, userUUID: string, type: TokenAction) {
        return this.http.get<object>(`${this.endpoint}/${type}`, <IssueTokenData>{
            amount: amount.toString(),
            uuid: userUUID,
            from: this.issuerAddress
        });
    }
}

interface IssueTokenData {
    amount: string;
    uuid: string;
    from: string;
}

enum TokenAction {
    BURN = 'burn',
    MINT = 'mint'
}

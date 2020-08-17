import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
    'providedIn': 'root'
})
export class WalletActivationService {

    private endpoint = '/wallet/cooperative/wallet';

    constructor(private http: HttpClient) {
    }

    getUnactivatedWallets(type: string) {
        return this.http.get(API.generateComplexRoute(this.endpoint, [
            type
        ]), API.tokenHeaders());
    }

    getActivationData(walletID: any) {
        return this.http.post(API.generateComplexRoute(this.endpoint, [
            walletID.toString(), 'transaction'
        ]), {}, API.tokenHeaders());
    }


}

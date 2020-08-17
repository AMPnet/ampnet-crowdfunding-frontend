import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
    providedIn: 'root'
})
export class DepositServiceService {

    private endpoint = '/wallet/deposit';

    constructor(private http: HttpClient) {
    }

    public createDeposit() {
        return this.http.post(API.generateRoute(this.endpoint), {}, API.tokenHeaders());
    }

    public getMyPendingDeposit() {
        return this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders());
    }

    public getPlatformBankAccounts() {
        return this.http.get(API.generateRoute('/wallet/bank-account'), API.tokenHeaders());
    }

    // not used
    public deleteDeposit(id: number) {
        return this.http.delete(API.generateComplexRoute(this.endpoint, [
            id.toString()
        ]), API.tokenHeaders());
    }

}

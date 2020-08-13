import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class WithdrawService {
    endpoint = '/wallet/withdraw';
    coopEndpoint = '/wallet/cooperative/withdraw';

    constructor(private http: BackendApiService) {
    }

    createWithdrawRequest(amount: number, iban: string) {
        return this.http.post(this.endpoint, {
            amount: amount.toString(),
            bank_account: iban
        });
    }

    generateApproveWithdrawTx(withdrawID: number) {
        return this.http.post(`${this.endpoint}/${withdrawID}/transaction/approve`, {});
    }

    generateBurnWithdrawTx(withdrawID: number) {
        return this.http.post(`${this.coopEndpoint}/${withdrawID}/transaction/burn`, {});
    }

    getMyPendingWithdraw() {
        return this.http.get(this.endpoint);
    }

    deleteWithdrawal(id: any) {
        return this.http.delete(`${this.endpoint}/${id}`);
    }
}

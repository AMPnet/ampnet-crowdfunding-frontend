import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class DepositCooperativeService {
    private endpoint = '/api/wallet/cooperative/deposit';

    constructor(private http: BackendApiService) {
    }

    createDeposit() {
        return this.http.post(this.endpoint, {});
    }

    getDeposit(reference: string) {
        return this.http.get(`${this.endpoint}/search`, {
            reference: reference
        });
    }

    generateDepositApprovalURL(id: number, amount: number): string {
        return `${this.endpoint}/approve?amount=${amount}`;
    }

    getUnapprovedDeposits() {
        return this.http.get(`${this.endpoint}/unapproved`);
    }

    getApprovedDeposits() {
        return this.http.get(`${this.endpoint}/approved`);
    }

    generateDepositMintTx(id: number) {
        return this.http.post(`${this.endpoint}/${id}/transaction`, {});
    }

    declineDeposit(id: number, comment: string) {
        return this.http.post(`${this.endpoint}/${id}/decline`, {
            comment: comment
        });
    }
}

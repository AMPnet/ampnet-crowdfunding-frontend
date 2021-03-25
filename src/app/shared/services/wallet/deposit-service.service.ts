import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DepositServiceService {
    private endpoint = '/api/wallet/deposit';
    private endpointProjectDeposit = '/api/wallet/deposit/project';

    constructor(private http: BackendHttpClient) {
    }

    pendingDeposit(projectUUID = ''): Observable<Deposit> {
        return !projectUUID ? this.pendingUserDeposit()
            : this.pendingProjectDeposit(projectUUID);
    }

    createDeposit(amount: number, projectUUID = ''): Observable<Deposit> {
        return !projectUUID ? this.createUserDeposit(amount)
            : this.createProjectDeposit(projectUUID, amount);
    }

    deleteDeposit(id: number) {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }

    private createUserDeposit(amount: number) {
        return this.http.post<Deposit>(this.endpoint, <CreateDepositData>{
            amount: amount
        });
    }

    private createProjectDeposit(projectID: string, amount: number) {
        return this.http.post<Deposit>(`${this.endpointProjectDeposit}/${projectID}`, <CreateDepositData>{
            amount: amount
        });
    }

    private pendingUserDeposit() {
        return this.http.get<Deposit>(`${this.endpoint}/pending`);
    }

    private pendingProjectDeposit(projectID: string) {
        return this.http.get<Deposit>(`${this.endpointProjectDeposit}/${projectID}/pending`);
    }
}

interface CreateDepositData {
    amount?: number;
}

export interface Deposit {
    id: number;
    owner: string;
    reference: string;
    approved: boolean;
    created_at: Date;
    created_by: string;
    type: string;
    approved_at?: any;
    amount: number;
    document_response?: any;
    tx_hash?: any;
    declined_at?: any;
    declined_comment?: any;
}

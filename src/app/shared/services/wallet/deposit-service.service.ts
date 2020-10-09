import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';


@Injectable({
    providedIn: 'root'
})
export class DepositServiceService {
    private endpoint = '/api/wallet/deposit';
    private endpointProjectDeposit = '/api/wallet/deposit/project';

    constructor(private http: BackendHttpClient) {
    }

    public createDeposit() {
        return this.http.post<Deposit>(this.endpoint, <CreateDepositData>{});
    }

    public createProjectDeposit(projectID: string) {
        return this.http.post<Deposit>(`${this.endpointProjectDeposit}/${projectID}`, <CreateDepositData>{});
    }

    public getMyPendingDeposit() {
        return this.http.get<Deposit>(this.endpoint);
    }

    public deleteDeposit(id: number) {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}

interface CreateDepositData {
    deposit?: number;
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

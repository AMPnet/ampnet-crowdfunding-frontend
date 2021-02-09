import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../../backend-http-client.service';
import { TransactionInfo, Wallet } from '../wallet.service';

@Injectable({
    'providedIn': 'root'
})
export class CoopWalletActivationService {
    private endpoint = '/api/wallet/cooperative/wallet';

    constructor(private http: BackendHttpClient) {
    }

    getUserWallets() {
        return this.http.get<CooperativeUserWallet>(`${this.endpoint}/user`);
    }

    getOrgWallets() {
        return this.http.get<CooperativeOrganizationWallet>(`${this.endpoint}/organization`);
    }

    getProjectWallets() {
        return this.http.get<CooperativeProjectWallet>(`${this.endpoint}/project`);
    }

    activateWallet(walletID: string | number) {
        return this.http.post<TransactionInfo>(`${this.endpoint}/${walletID}/transaction`, {});
    }
}

export interface CooperativeUserWallet {
    users: CooperativeUser[];
    page: number;
    total_pages: number;
}

export interface CooperativeUser {
    user: {
        uuid: string;
        email: string;
        first_name: string;
        last_name: string;
        enabled: boolean;
    };
    wallet: Wallet;
}

interface CooperativeOrganizationWallet {
    organizations: OrganizationWallet[];
    page: number;
    total_pages: number;
}

export interface OrganizationWallet {
    organization: {
        uuid: string;
        name: string;
        created_at: Date;
        approved: boolean;
    };
    wallet: Wallet;
}

interface CooperativeProjectWallet {
    projects: CooperativeProject[];
    page: number;
    total_pages: number;
}

export interface CooperativeProject {
    project: {
        uuid: string;
        name: string;
        description: string;
        end_date: Date;
        expected_funding: number;
        currency: string;
        min_per_user: number;
        max_per_user: number;
        active: boolean;
        image_url: string;
    };
    wallet: Wallet;
    payout_in_process?: any;
}

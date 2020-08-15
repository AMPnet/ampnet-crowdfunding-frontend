import { Injectable } from '@angular/core';
import { BackendApiService } from '../../backend-api.service';

@Injectable({
    'providedIn': 'root'
})
export class WalletCooperativeWalletService {
    private endpoint = '/api/wallet/cooperative/wallet';

    constructor(private http: BackendApiService) {
    }

    getUnactivatedUserWallets() {
        return this.http.get<CooperativeUserWallet>(`${this.endpoint}/user`);
    }

    getUnactivatedOrganizationWallets() {
        return this.http.get<CooperativeOrganizationWallet>(`${this.endpoint}/organization`);
    }

    getUnactivatedProjectWallets() {
        return this.http.get<CooperativeProjectWallet>(`${this.endpoint}/project`);
    }

    activateWallet(walletID: string) {
        return this.http.post<TransactionInfo>(`${this.endpoint}/${walletID}/transaction`, {});
    }
}

export interface CooperativeUserWallet {
    users: CooperativeUser[];
    page: number;
    total_pages: number;
}

interface CooperativeUser {
    user: {
        uuid: string;
        email: string;
        first_name: string;
        last_name: string;
        enabled: boolean;
    };
    wallet: Wallet;
}

export interface Wallet {
    uuid: string;
    activation_data: string;
    type: string;
    currency: string;
    created_at: Date;
    hash?: any;
    activated_at?: any;
    alias?: any;
    balance?: any;
}

interface CooperativeOrganizationWallet {
    organizations: Organization[];
    page: number;
    total_pages: number;
}

interface Organization {
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

interface CooperativeProject {
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

export interface WalletDetails {
    uuid: string;
    activation_data: string;
    type: string;
    currency: string;
    created_at: Date;
    hash?: any;
    activated_at?: any;
    alias?: any;
    balance?: any;
}

export interface TransactionInfo {
    tx: string;
    tx_id: number;
    info: {
        tx_type: string;
        title: string;
        description: string;
    };
}

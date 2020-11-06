import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { Project } from '../project/project.service';
import { TransactionInfo } from './wallet.service';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    constructor(private http: BackendHttpClient) {
    }

    getPortfolioStats() {
        return this.http.get<PortfolioStats>(`/api/wallet/portfolio/stats`);
    }

    getPortfolio() {
        return this.http.get<PortfolioResponse>('/api/wallet/portfolio');
    }

    getInvestmentsInProject(projectID: string) {
        return this.http.get<ProjectTransactions>(`/api/wallet/portfolio/project/${projectID}`);
    }

    generateCancelInvestmentTransaction(projectUUID: string) {
        return this.http.post<TransactionInfo>(`/api/wallet/invest/project/${projectUUID}/cancel`, {});
    }

    isInvestmentCancelable(projectWallet: string, userWallet: string) {
        return this.http.get<CancelableResult>(`/api/middleware/projects/${projectWallet}/investors/${userWallet}/cancelable`);
    }
}

export interface PortfolioStats {
    investments: number;
    earnings: number;
    date_of_first_investment: Date;
    roi?: number;
}

export interface PortfolioResponse {
    portfolio: Portfolio[];
}

export interface Portfolio {
    project: Project;
    investment: number;
}

export interface ProjectTransactions {
    project: Project;
    transactions: TxData[];
}

export interface TxData {
    from_tx_hash: string;
    to_tx_hash: string;
    amount: number;
    type: string;
    date: string;
}

interface CancelableResult {
    can_cancel: boolean;
}

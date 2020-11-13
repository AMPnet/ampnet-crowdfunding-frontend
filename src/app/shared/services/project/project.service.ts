import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { DocumentModel } from './organization.service';
import { CacheService } from '../cache.service';
import { Wallet } from '../wallet/wallet.service';
import { Observable, of } from 'rxjs';

@Injectable({
    'providedIn': 'root'
})
export class ProjectService {
    constructor(private http: BackendHttpClient,
                private cacheService: CacheService) {
    }

    createProject(projectData: CreateProjectData) {
        return this.http.post<Project>('/api/project/project', projectData);
    }

    getProject(projectID: string) {
        return this.http.get<Project>(`/api/project/public/project/${projectID}`);
    }

    updateProject(projectID: string, data: UpdateProjectData,
                  image?: File, documents?: File[]) {
        const formData = new FormData();

        formData.append('request', new Blob([JSON.stringify(data)], {
            type: 'application/json'
        }), 'request.json');

        if (image) {
            formData.append('image', image, image.name);
        }

        if (!!documents && documents.length > 0) {
            documents.forEach(document => {
                formData.append('documents', document, document.name);
            });
        }

        return this.http.put<Project>(`/api/project/project/${projectID}`, formData);
    }

    getAllActiveProjects() {
        return this.http.get<PageableProjectsResponse>('/api/project/public/project/active');
    }

    getAllActiveProjectsCached() {
        return this.cacheService.setAndGet('projects/active', this.getAllActiveProjects(), 30_000);
    }

    getProjectInfo(projectID: string) {
        return this.http.get<ProjectInfo>(`/api/projects/${projectID}`);
    }

    // getInvestmentDetails(projectID: string, investorHash: string) {
    // return this.http.get<InvestmentDetails>(`/projects/${projectID}/investors/${investorHash}/details`);
    getInvestmenDetails2() {
        return this.http.get<InvestmentDetails>(`/api/projects/th_22gRkbS2NE5bjByvMvHhA95nDqXTuUCAkD14p1pnPVBbzsBbj9/investors/th_pJ66jnJUcWauoYyRVU1afzXRGnGYR3wYoM8UNoyy44WDRarJP/details`);
    }

    getInvestmentDetails(): Observable<InvestmentDetails> {
        // Todo: fake data - create http request
        const investmentDetails: InvestmentDetails = {
            amountInvested: 10000000,
            investmentCancelable: true,
            payoutInProcess: false,
            totalFundsRaised: 120000,
            walletBalance: 800000
        };
        return of(investmentDetails);
    }
}

export interface ProjectInfo {
    projectHash: string;
    minPerUserInvestment: number;
    maxPerUserInvestment: number;
    investmentCap: number;
    endsAt: Date;
    totalFundsRaised: number;
    payoutInProcess: boolean;
    balance: number;
}

export interface InvestmentDetails {
    walletBalance: number;
    amountInvested: number;
    totalFundsRaised: number;
    investmentCancelable: boolean;
    payoutInProcess: boolean;
}

interface CreateProjectData {
    organization_uuid: string;
    name: string;
    description: string;
    location: { lat: number; long: number; };
    roi: { from: number; to: number; };
    start_date: Date;
    end_date: Date;
    expected_funding: number;
    currency: string;
    min_per_user: number;
    max_per_user: number;
    active: boolean;
    tags?: string[];
}

interface UpdateProjectData {
    name?: string;
    description?: string;
    location?: { lat: number; long: number; };
    roi?: { from: number; to: number; };
    active?: boolean;
    tags?: string[];
    news?: string[];
}

export interface Project {
    uuid: string;
    name: string;
    description: string;
    location: { lat: number, long: number };
    location_text: string;
    roi: { from: number, to: number };
    start_date: string;
    end_date: string;
    expected_funding: number;
    currency: string;
    min_per_user: number;
    max_per_user: number;
    main_image: string;
    news: string[];
    documents: DocumentModel[];
    gallery: string[];
    active: boolean;
}

export interface PageableProjectsResponse {
    projects_wallets: ProjectWallet[];
    page: number;
    total_pages: number;
}

export interface ProjectWallet {
    project: Project;
    wallet: Wallet;
}

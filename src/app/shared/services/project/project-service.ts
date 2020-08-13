import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';
import { ProjectModel } from '../../../projects/project-model';
import { Wallet, WalletActivationService, WalletDetails } from '../wallet/wallet-activation.service';

@Injectable({
    'providedIn': 'root'
})
export class ProjectService {
    constructor(private http: BackendApiService) {
    }

    createProject(projectData: CreateProjectData) {
        return this.http.post<ProjectModel>('/api/project/project', projectData);
    }

    getProjectWallet(projectID: string) {
        return this.http.get<WalletDetails>(`/api/wallet/public/wallet/project/${projectID}`);
    }

    generateTransactionToCreateProjectWallet(projectID: string) {
        return this.http.get(`/api/wallet/wallet/project/${projectID}/transaction`);
    }

    getProject(projectID: string) {
        return this.http.get(`/api/public/project/${projectID}`);
    }

    updateProject(projectID: string, data: UpdateProjectData) {
        return this.http.put(`/api/project/project/${projectID}`, data);
    }
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

export interface ProjectModel {
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
    documents: [string];
    gallery: [string];
    active: boolean;
    wallet_hash: string;
}

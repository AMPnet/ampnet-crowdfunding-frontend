import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { DocumentModel } from './organization.service';
import { Wallet } from '../wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { CacheService } from '../cache.service';

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
    gallery: [string];
    active: boolean;
}

export interface PageableProjectsResponse {
    projects_with_wallet: ProjectWallet[];
    page: number;
    total_pages: number;
}

export interface ProjectWallet {
    project: Project;
    wallet: Wallet;
}

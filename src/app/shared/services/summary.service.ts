import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../utilities/endpoint-manager';
import { retry } from 'rxjs/operators';

@Injectable({
    'providedIn': 'root'
})
export class SummaryService {
    constructor(private http: HttpClient) {
    }

    getUsers() {
        return this.http.get<CountRegisteredUsersResponse>('/api/user/public/user/count');
    }

    getNumberOfActiveProjects() {
        return this.http.get<CountActiveProjectsResponse>('/api/project/public/project/active/count');
    }

    getBlockchainMiddlewareData() {
        return this.http.get<MiddlewareSummaryResponse>('/api/middleware/summary');
    }
}

interface CountActiveProjectsResponse {
    active_projects: number;
}

interface CountRegisteredUsersResponse {
    registered: number;
}

interface MiddlewareSummaryResponse {
    number_of_funded_projects: number;
    average_project_size: number;
    average_funded_project_size: number;
    average_user_investment: number;
    total_money_raised: number;
}

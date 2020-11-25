import { Injectable } from '@angular/core';
import { BackendHttpClient } from './backend-http-client.service';
import { AppConfigService } from './app-config.service';

@Injectable({
    providedIn: 'root'
})
export class SummaryService {
    constructor(private http: BackendHttpClient,
                private appConfig: AppConfigService) {
    }

    getUsers() {
        return this.http.get<CountRegisteredUsersResponse>('/api/user/public/user/count', {
            coop: this.appConfig.config.identifier
        });
    }

    getNumberOfActiveProjects() {
        return this.http.get<CountActiveProjectsResponse>('/api/project/public/project/active/count', {
            coop: this.appConfig.config.identifier
        });
    }

    getBlockchainMiddlewareData() {
        return this.http.get<MiddlewareSummaryResponse>('/api/middleware/summary', {
            coop: this.appConfig.config.identifier
        });
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

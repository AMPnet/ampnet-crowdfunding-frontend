import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { AppConfig, CustomConfig } from '../app-config.service';

@Injectable({
    providedIn: 'root'
})
export class CoopService {
    constructor(private http: BackendHttpClient) {
    }

    createCoop(data: CreateCoopData) {
        return this.http.post<AppConfig>(`/api/user/coop`, data, true);
    }

    updateCoop(data: UpdateCoopData) {
        return this.http.put<AppConfig>(`/api/user/coop`, data);
    }

    getCoop() {
        return this.http.get<AppConfig>(`/api/user/coop`);
    }
}

export interface CreateCoopData {
    identifier: string;
    name: string;
    hostname?: string;
    config?: CustomConfig;
}

interface UpdateCoopData {
    name: string;
    hostname: string;
    config: CustomConfig;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { ProjectModel } from './create-new-project/project-model';

@Injectable({
    'providedIn': 'root'
})
export class ProjectService {

    private endpoint = '/project';
    private publicEndpoint = '/public/project';
    private publicWalletEndpoint = '/wallet/public/wallet';
    private walletEndpoint = '/wallet/wallet';

    constructor(private http: HttpClient) {
    }

    createProject(organizationID: string,
                  name: string,
                  description: string,
                  location: any,
                  locationText: string,
                  returnOnInvestment: any,
                  startDate: string,
                  endDate: string,
                  expectedFunding: number,
                  currency: string,
                  minInvestmentPerUser: number,
                  maxInvestmentPerUser: number,
                  active: boolean) {

        return this.http.post(API.generateRoute(this.endpoint), {
            'organization_uuid': organizationID,
            'name': name,
            'description': description,
            'location': location,
            'roi': returnOnInvestment,
            'start_date': startDate,
            'end_date': endDate,
            'expected_funding': expectedFunding,
            'currency': currency,
            'min_per_user': minInvestmentPerUser,
            'max_per_user': maxInvestmentPerUser,
            'active': false
        }, API.tokenHeaders());

    }

    getProjectWallet(projectID: string) {
        return this.http.get(API.generateComplexRoute(this.publicWalletEndpoint, [
            'project', projectID.toString()
        ]));
    }

    generateTransactionToCreateProjectWallet(projectID: string) {
        return this.http.get(API.generateComplexRoute(this.walletEndpoint, [
            'project', projectID.toString(), 'transaction'
        ]), API.tokenHeaders());
    }

    getProject(projectID: string) {
        return this.http.get<ProjectModel>(API.generateComplexRoute(this.publicEndpoint, [
            projectID.toString()
        ]));
    }

    updateProject(projectID: string, name: string, description: string,
                  location: { lat: string, long: string }, roi: { from: number, to: number }, active: boolean) {
        return this.http.put(API.generateComplexRoute(this.endpoint, [
            projectID.toString()
        ]), {
            'name': name,
            'description': description,
            'location': location,
            'roi': roi,
            'active': active.toString(),
            'tags': null,
            'news': null
        }, API.tokenHeaders());
    }
}

export interface RootObject {
    uuid: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    enabled: boolean;
    verified: boolean;
}

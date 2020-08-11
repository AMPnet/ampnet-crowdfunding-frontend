import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
    providedIn: 'root'
})
export class InvestService {

    private projectEndpoint = '/project';

    constructor(private http: HttpClient) {
    }

    generateInvestTransaction(projectID: number, amount: number) {
        return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
            projectID.toString()
        ]), {
            params: {
                'amount': amount.toString()
            },
            headers: {
                'Authorization': API.tokenHeaders().headers.Authorization
            }
        });
    }

    generateInvestApprovalTransaction(projectID: number) {
        return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
            projectID.toString()
        ]), API.tokenHeaders());
    }
}

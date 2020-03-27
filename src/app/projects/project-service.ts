import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API } from "../utilities/endpoint-manager";

@Injectable({
    "providedIn" : "root"
})
export class ProjectService {

    private endpoint = "/project"
    private publicEndpoint = "/public/project"
    private publicWalletEndpoint = "/wallet/public/wallet";
    private walletEndpoint = "/wallet"

    constructor(private http: HttpClient) { }

    createProject(organizationID: string, 
        name: string,
        description: string,
        location: string,
        locationText: string,
        returnOnInvestment: string,
        startDate: string,
        endDate: string,
        expectedFunding: number,
        currency: string,
        minInvestmentPerUser: number,
        maxInvestmentPerUser: number,
        active: boolean) {

        return this.http.post(API.generateRoute(this.endpoint), {
            "organization_uuid": organizationID,
            "name" : name,
            "description" : description,
            "location" : location,
            "location_text" : locationText,
            "return_on_investment": returnOnInvestment,
            "start_date": startDate,
            "end_date": endDate,
            "expected_funding": expectedFunding,
            "currency": currency,
            "min_per_user": minInvestmentPerUser,
            "max_per_user": maxInvestmentPerUser,
            "active" : false
        }, API.tokenHeaders())

    }

    getProjectWallet(projectID: string) {
        return this.http.get(API.generateComplexRoute(this.publicWalletEndpoint, [
            "project", projectID.toString()
        ]) );
    }

    generateTransactionToCreateProjectWallet(projectID: string) {

        return this.http.get(API.generateComplexRoute(this.walletEndpoint, [
            "project", projectID.toString(), "transaction"
        ]), API.tokenHeaders());
    }

    getProject(projectID: string) {
        return this.http.get(API.generateComplexRoute(this.publicEndpoint, [
            projectID.toString()
        ]));
    }

    updateProject(projectID: string, name: string, description: string,
        location: string, locationText: string, roi: string, active: boolean) {
        return this.http.post(API.generateComplexRoute(this.endpoint, [
            projectID.toString()
        ]), { 
            "name": name,
            "description": description,
            "location": location,
            "location_text": locationText,
            "return_on_investment": roi,
            "active": active.toString()
        }, API.tokenHeaders())
    }
}
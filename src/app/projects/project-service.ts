import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API } from "../utilities/endpoint-manager";

@Injectable({
    "providedIn" : "root"
})
export class ProjectService {

    private endpoint = "/project"

    constructor(private http: HttpClient) { }

    createProject(organizationID: number, 
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

        this.http.post(API.generateRoute(this.endpoint), {
            "organization_id": organizationID,
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
            "max_per_user": maxInvestmentPerUser
        }, API.tokenHeaders())

    }

}
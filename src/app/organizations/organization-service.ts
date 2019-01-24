import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API } from "../utilities/endpoint-manager";

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    private endpoint = "/organization";

    constructor(private http: HttpClient) { }
    
    createOrganization(name: string, legalInfo: string) {
        return this.http.post(API.generateRoute(this.endpoint), {
            "name": name,
            "legal_info": legalInfo
        }, API.tokenHeaders());
    }

}
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API } from "../utilities/endpoint-manager";

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    private endpoint = "/organization";
    private walletEndpoint = "/wallet/wallet/organization";
    private inviteEndpoint = "/invites"
    private projectEndpoint = "/organization";

    constructor(private http: HttpClient) { }
    
    createOrganization(name: string, legalInfo: string) {
        return this.http.post(API.generateRoute(this.endpoint), {
            "name": name,
            "legal_info": legalInfo
        }, API.tokenHeaders());
    }

    getPersonalOrganizations() {
        return this.http.get(API.generateRoute(this.endpoint + "/personal"), API.tokenHeaders())
    }

    getSingleOrganization(id: string) {
        return this.http
            .get(API.generateComplexRoute(
                this.endpoint, 
                [id.toString()]), 
                API.tokenHeaders()
            );
    }

    getOrganizationWallet(orgID: number) {
        return this.http.get(API.generateComplexRoute(
            this.walletEndpoint,
            [orgID.toString()],
        ), API.tokenHeaders())
    }

    getTransactionForCreationOfOrgWallet(orgID: string) {
        return this.http.get(API.generateComplexRoute(
            this.walletEndpoint,
            [orgID.toString(), "transaction"]
        ), API.tokenHeaders());
    }

    getAllOrganizations() {
        return this.http.get(API.generateRoute(this.endpoint),
        API.tokenHeaders());
    }

    approveOrganization(orgID: number) {
        return this.http.post(
            API.generateComplexRoute(this.endpoint, [orgID.toString(), "approve"]), {},
            API.tokenHeaders()
        );
    }

    inviteUser(orgID: string, userEmail: string) {
        return this.http.post(API.generateComplexRoute(
            this.inviteEndpoint, ["organization", orgID.toString(), "invite"]), {
                "email": userEmail,
                "role_type": "ORG_MEMBER"
            }, API.tokenHeaders()
        );
    }

    getMyInvitations() {
        return this.http.get(API.generateComplexRoute(this.inviteEndpoint, ["me"]),
        API.tokenHeaders())
    }
    
    acceptInvite(orgID: number) {
        return this.http.post(API.generateComplexRoute(this.inviteEndpoint, 
            [
                "me", orgID.toString(), "accept"
            ]), { }, API.tokenHeaders()
        );
    }

    getAllProjectsForOrganization(orgID: string) {
        return this.http.get(API.generateComplexRoute(this.projectEndpoint,
            [orgID.toString()]    
        ), API.tokenHeaders());
    }
    
    getMembersForOrganization(orgID: string) {
        return this.http.get(API.generateComplexRoute(this.endpoint, [
            orgID.toString(), "members"
        ]), API.tokenHeaders());
    }

}
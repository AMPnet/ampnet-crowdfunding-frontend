import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { PageableProjectsResponse, Project } from './project.service';
import { Wallet } from '../wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor(private http: BackendHttpClient) {
    }

    createOrganization(name: string, description: string, photo: File) {
        const formData = new FormData();

        const orgInfo = {
            name: name,
            description: description
        };

        formData.append('image', photo, 'image.png');
        formData.append('request', new Blob([JSON.stringify(orgInfo)], {
            type: 'application/json'
        }), 'request.json');

        return this.http.post<Organization>('/api/project/organization', formData);
    }

    getPersonalOrganizations() {
        return this.http.get<PageableOrganizationsResponse>('/api/project/organization/personal');
    }

    getSingleOrganization(orgID: string) {
        return this.http.get<Organization>(`/api/project/organization/${orgID}`);
    }

    getAllOrganizations() {
        return this.http.get<PageableOrganizationsResponse>('/api/project/organization');
    }

    inviteUser(orgID: string, userEmail: string) {
        return this.http.post<void>(`/api/project/invites/organization/${orgID}/invite`, {
            email: userEmail,
            role_type: 'ORG_MEMBER'
        });
    }

    getMyInvitations() {
        return this.http.get<OrganizationInvitesResponse>('/api/project/invites/me');
    }

    acceptInvite(orgID: number) {
        return this.http.post<void>(`/api/project/invites/me/${orgID}/accept`, {});
    }

    getAllProjectsForOrganization(orgID: string) {
        return this.http.get<PageableOrganizationProjectsResponse>(`/api/project/public/project/organization/${orgID}`);
    }

    getMembersForOrganization(orgID: string) {
        return this.http.get<OrganizationMembersResponse>(`/api/project/organization/${orgID}/members`);
    }

    removeMemberFromOrganization(orgID: string, memberID: string) {
        return this.http.delete<void>(`/api/project/organization/${orgID}/members/${memberID}`);
    }
}

export interface Organization {
    uuid: string;
    name: string;
    created_at: string;
    approved: boolean;
    legal_info: string;
    documents?: DocumentModel[];
    wallet_hash?: string;
}

export interface DocumentModel {
    id: number;
    link: string;
    name: string;
    type: string;
    size: number;
    created_at: string;
}

interface PageableOrganizationsResponse {
    organizations: Organization[];
    page: number;
    total_pages: number;
}

interface OrganizationInvitesResponse {
    organization_invites: OrganizationInvite[];
}

export interface OrganizationInvite {
    organization_uuid: string;
    organization_name: string;
    role: string;
}

interface OrganizationMembersResponse {
    members: OrganizationMember[];
}

export interface OrganizationMember {
    uuid: string;
    first_name: string;
    last_name: string;
    role: string;
    member_since: Date;
}

export interface PageableOrganizationProjectsResponse {
    projects: Project[];
    page: number;
    total_pages: number;
}

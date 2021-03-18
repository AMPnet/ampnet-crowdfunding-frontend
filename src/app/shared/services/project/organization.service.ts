import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { ProjectWallet } from './project.service';
import { AppConfigService } from '../app-config.service';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor(private http: BackendHttpClient,
                private appConfig: AppConfigService) {
    }

    createOrganization(name: string, description: string, photo: File) {
        const formData = new FormData();

        const orgInfo = {
            name: name,
            description: description
        };

        formData.append('image', photo, photo.name);
        formData.append('request', new Blob([JSON.stringify(orgInfo)], {
            type: 'application/json'
        }), 'request.json');

        return this.http.post<Organization>('/api/project/organization', formData);
    }

    getPersonal() {
        return this.http.get<PageableOrganizationsResponse>('/api/project/organization/personal');
    }

    get(orgID: string) {
        return this.http.get<Organization>(`/api/project/public/organization/${orgID}`);
    }

    inviteUser(orgID: string, emails: string[]) {
        return this.http.post<void>(`/api/project/invites/organization/${orgID}/invite`, {
            emails: emails
        });
    }

    getMyInvitations() {
        return this.http.get<OrganizationInvitesResponse>('/api/project/invites/me');
    }

    acceptInvite(orgID: string) {
        return this.http.post<void>(`/api/project/invites/me/${orgID}/accept`, {});
    }

    getAllProjectsForOrganization(orgID: string) {
        return this.http.get<PageableOrganizationProjectsResponse>(`/api/project/public/project/organization/${orgID}`, {
            coop: this.appConfig.config.identifier
        });
    }

    getMembersForOrganization(orgID: string, options = {isPublic: true}) {
        return options.isPublic ? this.http.get<OrganizationMembersResponse>(`/api/project/public/organization/${orgID}/members`) :
            this.http.get<OrganizationMembersResponse>(`/api/project/organization/${orgID}/members`);
    }

    removeMemberFromOrganization(orgID: string, memberID: string) {
        return this.http.delete<void>(`/api/project/organization/${orgID}/members/${memberID}`);
    }
}

export interface Organization {
    uuid: string;
    name: string;
    owner_uuid: string;
    created_at: string;
    approved: boolean;
    description: string;
    header_image: string;
    legal_info: string;
    documents?: Document[];
    wallet_hash?: string;
    project_count: number;
}

export interface OrganizationBasic {
    uuid: string;
    name: string;
}

export interface Document {
    id: number;
    link: string;
    name: string;
    type: string;
    purpose: DocPurpose;
    size: number;
    created_at: string;
}

export enum DocPurpose {
    GENERIC = 'GENERIC',
    TERMS = 'TERMS'
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
    organization_header_image: string;
}

interface OrganizationMembersResponse {
    members: OrganizationMember[];
}

export interface OrganizationMember {
    uuid?: string;
    first_name: string;
    last_name: string;
    email?: string;
    role: string;
    member_since: Date;
}

export interface PageableOrganizationProjectsResponse {
    projects_wallets: ProjectWallet[];
    page: number;
    total_pages: number;
}

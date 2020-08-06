export interface OrganizationModel {
    uuid: string;
    name: string;
    created_at: string;
    approved: boolean;
    legal_info: string;
    documents: [DocumentModel];
    wallet_hash: string;
}

export interface DocumentModel {
    id: number;
    link: string;
    name: string;
    type: string;
    size: number;
    created_at: string;
}

export interface WalletModel {
    id; number;
    hash: string;
    type: string;
    balance: number;
    currency: string;
    created_at: string;
}

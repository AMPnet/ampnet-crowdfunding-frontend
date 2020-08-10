export interface SingleOrgModel {
    id: number;
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
    createdAt: string;
}

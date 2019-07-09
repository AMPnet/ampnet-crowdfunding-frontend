interface SingleOrgModel {
    id: number,
    name: string,
    createdAt: string,
    approved: boolean,
    legalInfo: string,
    documents: [DocumentModel],
    walletHash: string
}

interface DocumentModel {
    id: number,
    link: string,
    name: string,
    type: string,
    size: number,
    createdAt: string
}
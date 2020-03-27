export interface DepositCoreModel {
    deposit:DepositModel,
    user: DepositUserModel
}


export interface DepositModel {
    id: number,
    user: DepositUserModel,
    reference: string,
    approved: boolean,
    approved_at: string,
    amount: number,
    document_response: DocumentResponseModel,
    created_at: string
}

export interface DepositUserModel {
    uuid: string,
    email: string,
    first_name: string,
    last_name: string,
    enabled: boolean
}

export interface DocumentResponseModel {
    id: number,
    link: string,
    name: string,
    type: string,
    size: number,
    created_at: string
}
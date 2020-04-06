import { ProjectModel } from "../projects/create-new-project/project-model";

export interface PortfolioRoot {
    project: ProjectModel,
    investment: number
}

export interface PortfolioStats {
    investments: number,
    earnings: number,
    date_of_first_investment: string
}

export interface InvestmentsInProject {
    project: ProjectModel
    transactions: TxData[]
}

export interface TxData {
    from_tx_hash: string,
    to_tx_hash: string,
    amount: number,
    type: string,
    date: string    
}
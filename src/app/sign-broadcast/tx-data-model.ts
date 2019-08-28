export interface TXFullDataModel {
    base_url: String,
    tx_data: TXDataModel
}

interface TXDataModel {
    tx_id: number,
    info: TXInfoData
    tx: string
}

interface TXInfoData {
    description: String,
    title: String,
    tx_type: String
}
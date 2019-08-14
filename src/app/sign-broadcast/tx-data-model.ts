export interface TXFullDataModel {
    base_url: String,
    tx_data: TXDataModel
}

interface TXDataModel {
    tx_id: number,
    info: TXInfoData
    tx: TXDataModel
}

interface TXDataModel {
    data: String,
    to: String,
    nonce: number,
    gas_limit: number,
    gas_price: number,
    value: number,
    public_key: String
}

interface TXInfoData {
    description: String,
    title: String,
    tx_type: String
}
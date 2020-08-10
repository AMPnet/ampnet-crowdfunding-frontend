export interface PaymentModels {
    bank_accounts: SinglePaymentModel[];
}

export interface SinglePaymentModel {
    id: number;
    iban: string;
    bank_code: string;
    created_at: string;
    alias: string;
}

export interface PaymentOptionModel {
    name: string;
    type: PaymentOptionType;
    active: boolean;
}

export enum PaymentOptionType {
    bankAccount, creditCard
}

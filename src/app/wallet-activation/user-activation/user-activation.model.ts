export interface UserActivationModel {
    user: UserActivationUserSubmodel,
    wallet: UserActivationWalletModel
}

interface UserActivationUserSubmodel {
    uuid: string,
    email: string,
    first_name: string,
    last_name: string,
    enabled: boolean
}

interface UserActivationWalletModel {
    id: number;
}
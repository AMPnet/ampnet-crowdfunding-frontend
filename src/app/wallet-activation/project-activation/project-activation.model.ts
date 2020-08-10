export interface ProjectActivationModel {
    organization: any;
    wallet: ProjectActivationWalletModel;
}

interface ProjectActivationWalletModel {
    uuid: string;
}

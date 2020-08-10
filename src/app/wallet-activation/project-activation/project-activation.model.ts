import { OrganizationModel } from 'src/app/organizations/organization-details/organization-model';

export interface ProjectActivationModel {
    organization: any;
    wallet: ProjectActivationWalletModel;
}

interface ProjectActivationWalletModel {
    uuid: string;
}

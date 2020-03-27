import { OrganizationModel } from "src/app/organizations/organization-details/organization-model";

export interface GroupActivationModel {
    organization: OrganizationModel,
    wallet: GroupActivationWalletModel
}

interface GroupActivationWalletModel {
    uuid: string
}
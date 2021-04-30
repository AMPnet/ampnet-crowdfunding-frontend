// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageWithdrawalsComponent } from './manage-withdrawals/manage-withdrawals.component';
import { SingleWithdrawalComponent } from './manage-withdrawals/single-withdrawal/single-withdrawal.component';
import { ManageDepositsComponent } from './manage-deposits/manage-deposits.component';
import { WalletActivationComponent } from './wallet-activation/wallet-activation.component';
import { ManageSingleDepositComponent } from './manage-deposits/manage-single-deposit/manage-single-deposit.component';
import { PlatformBankAccountComponent } from './platform-bank-account/platform-bank-account.component';
import { NewPlatformBankAccountComponent } from './platform-bank-account/new-platform-bank-account/new-platform-bank-account.component';
import { OwnershipComponent } from './ownership/ownership.component';
import { PlatformComponent } from './platform/platform.component';
import { PlatformConfigComponent } from './platform/platform-config/platform-config.component';
import { PlatformUsersComponent } from './platform/platform-users/platform-users.component';

const routes: Routes = [
    {path: 'manage_withdrawals', component: ManageWithdrawalsComponent},
    {path: 'manage_withdrawals/:id', component: SingleWithdrawalComponent},
    {path: 'manage_deposits', component: ManageDepositsComponent},
    {path: 'manage_deposits/:id', component: ManageSingleDepositComponent},
    {path: 'activation/:type', component: WalletActivationComponent},
    {path: 'platform_bank_account', component: PlatformBankAccountComponent},
    {path: 'platform_bank_account/new', component: NewPlatformBankAccountComponent},
    {path: 'ownership', component: OwnershipComponent},
    {
        path: 'platform', component: PlatformComponent, children: [
            {path: '', pathMatch: 'full', redirectTo: 'config'},
            {path: 'config', component: PlatformConfigComponent},
            {path: 'users', component: PlatformUsersComponent}
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}

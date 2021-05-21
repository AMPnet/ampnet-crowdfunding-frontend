import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManageWithdrawalsComponent } from './manage-withdrawals/manage-withdrawals.component';
import { SingleWithdrawalComponent } from './manage-withdrawals/single-withdrawal/single-withdrawal.component';
import { ManageDepositsComponent } from './manage-deposits/manage-deposits.component';
import { ManageSingleDepositComponent } from './manage-deposits/manage-single-deposit/manage-single-deposit.component';
import { ManageSingleDepositModalComponent } from './manage-deposits/manage-single-deposit/manage-single-deposit-modal/manage-single-deposit-modal.component';
import { OwnershipComponent } from './ownership/ownership.component';
import { PlatformBankAccountComponent } from './platform-bank-account/platform-bank-account.component';
import { NewPlatformBankAccountComponent } from './platform-bank-account/new-platform-bank-account/new-platform-bank-account.component';
import { PlatformConfigComponent } from './platform/platform-config/platform-config.component';
import { WalletActivationComponent } from './wallet-activation/wallet-activation.component';
import { AdminRoutingModule } from './admin-routing.module';
import { PlatformComponent } from './platform/platform.component';
import { PlatformUsersComponent } from './platform/platform-users/platform-users.component';
import { PlatformStatsComponent } from './platform/platform-analytics/platform-stats.component';

@NgModule({
    declarations: [
        ManageWithdrawalsComponent,
        SingleWithdrawalComponent,
        ManageDepositsComponent,
        ManageSingleDepositComponent,
        ManageSingleDepositModalComponent,
        OwnershipComponent,
        PlatformBankAccountComponent,
        NewPlatformBankAccountComponent,
        WalletActivationComponent,
        PlatformComponent,
        PlatformConfigComponent,
        PlatformUsersComponent,
        PlatformStatsComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule
    ]
})
export class AdminModule {
}

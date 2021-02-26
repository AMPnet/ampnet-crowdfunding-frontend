// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { MyPortfolioComponent } from './my-portfolio/my-portfolio.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { NewPaymentOptionComponent } from './payment-options/new-payment-option/new-payment-option.component';
import { AuthGuard } from './authentication/auth.guard';
import { ManageWithdrawalsComponent } from './admin/manage-withdrawals/manage-withdrawals.component';
import { SingleWithdrawalComponent } from './admin/manage-withdrawals/single-withdrawal/single-withdrawal.component';
import { ManageDepositsComponent } from './admin/manage-deposits/manage-deposits.component';
import { DepositComponent } from './deposit/deposit.component';
import { ManageSingleDepositComponent } from './admin/manage-deposits/manage-single-deposit/manage-single-deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WalletActivationComponent } from './admin/wallet-activation/wallet-activation.component';
import { PlatformBankAccountComponent } from './admin/platform-bank-account/platform-bank-account.component';
import { NewPlatformBankAccountComponent } from './admin/platform-bank-account/new-platform-bank-account/new-platform-bank-account.component';
import { OwnershipComponent } from './admin/ownership/ownership.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { SignInAutoComponent } from './authentication/sign-in-auto/sign-in-auto.component';
import { IdentityComponent } from './settings/user/identity/identity.component';
import { UserComponent } from './settings/user/user.component';
import { CoopGuard } from './shared/guards/coop.guard';
import { AuthLayoutComponent } from './authentication/auth-layout/auth-layout.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { NewInstanceComponent } from './authentication/new-instance/new-instance.component';
import { PlatformConfigComponent } from './admin/platform-config/platform-config.component';
import { IdentityGuard } from './settings/user/identity/identity.guard';
import { VeriffComponent } from './settings/user/identity/veriff/veriff.component';
import { TermsAcceptedGuard } from './settings/user/identity/accept-terms/terms-accepted.guard';
import { AcceptTermsComponent } from './settings/user/identity/accept-terms/accept-terms.component';
import { IdentyumComponent } from './settings/user/identity/identyum/identyum.component';
import { StaticPageComponent } from './static-page/static-page.component';
import { NoAuthGuard } from './authentication/no-auth.guard';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { ProjectNewComponent } from './projects/project-new/project-new.component';
import { GroupNewComponent } from './groups/group-new/group-new.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { GroupComponent } from './groups/group/group.component';
import { ProjectsComponent } from './projects/projects.component';
import { OfferComponent } from './offers/offer/offer.component';
import { OfferGuard } from './offers/offer/offer.guard';
import { OfferInvestComponent } from './offers/offer-invest/offer-invest.component';
import { OfferInvestVerifyComponent } from './offers/offer-invest-verify/offer-invest-verify.component';
import { ProjectDepositComponent } from './projects/project-deposit/project-deposit.component';
import { ProjectWithdrawComponent } from './projects/project-withdraw/project-withdraw.component';
import { ProjectRevenueShareComponent } from './projects/project-revenue-share/project-revenue-share.component';

const appRoutes: Routes = [
    {
        path: '', component: PublicLayoutComponent,
        children: [
            {
                path: '', canActivate: [NoAuthGuard], children: [
                    {path: '', pathMatch: 'full', redirectTo: 'offers'},
                    // {path: '', component: LandingPageComponent}, TODO: chat with others if this is OK
                    {path: 'offers', component: OffersComponent, data: {isOverview: true}},
                    {path: 'offers/:id', component: OfferComponent, canActivate: [OfferGuard], data: {isOverview: true}},
                    {path: 'groups/:id', component: GroupComponent, data: {isPublic: true, isOverview: true}},
                    {path: 'sign_in_auto/:email/:password', component: SignInAutoComponent},
                ]
            },
            {
                path: '', canActivate: [NoAuthGuard], component: AuthLayoutComponent, children: [
                    {path: 'sign_up', component: SignUpComponent},
                    {path: 'sign_in', component: SignInComponent},
                    {path: 'forgot_password', component: ForgotPasswordComponent},
                    {path: 'reset_password', component: ResetPasswordComponent},
                    {path: 'new_instance', component: NewInstanceComponent},
                ]
            },
            {path: 'static/:page', component: StaticPageComponent},
        ]
    },
    {
        path: 'dash', component: SecureLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'offers'},
            {path: 'offers', component: OffersComponent},
            {path: 'offers/:id', component: OfferComponent},
            {path: 'offers/:id/invest', component: OfferInvestComponent},
            {path: 'offers/:id/invest/:amount', component: OfferInvestVerifyComponent},

            {path: 'wallet', component: WalletComponent},
            {path: 'wallet/deposit', component: DepositComponent},
            {path: 'wallet/withdraw', component: WithdrawComponent},

            {path: 'projects', component: ProjectsComponent},
            {path: 'projects/new', component: ProjectNewComponent},
            {path: 'projects/:id', component: OfferComponent},
            {path: 'projects/:id/edit', component: ProjectEditComponent},
            {path: 'projects/:id/deposit', component: ProjectDepositComponent},
            {path: 'projects/:id/withdraw', component: ProjectWithdrawComponent},
            {path: 'projects/:id/revenue_share/:amount', component: ProjectRevenueShareComponent},

            {path: 'groups/new', component: GroupNewComponent},
            {path: 'groups/:id', component: GroupComponent},
            {path: 'groups/:id/edit', component: GroupEditComponent},

            {path: 'my_portfolio', component: MyPortfolioComponent},
            {path: 'my_portfolio/:id', component: OfferComponent, data: {isPortfolioView: true}},

            {path: 'payment_options', component: PaymentOptionsComponent},
            {path: 'payment_options/new', component: NewPaymentOptionComponent},
            {
                path: 'settings', children: [
                    {path: 'user', component: UserComponent},
                    {
                        path: 'user/identity', component: IdentityComponent, canActivate: [IdentityGuard], children: [
                            {path: '', component: AcceptTermsComponent},
                            {path: 'veriff', component: VeriffComponent, canActivate: [TermsAcceptedGuard]},
                            {path: 'identyum', component: IdentyumComponent, canActivate: [TermsAcceptedGuard]}
                        ]
                    },
                ]
            },

            {path: 'manage_withdrawals', component: ManageWithdrawalsComponent},
            {path: 'manage_withdrawals/:ID', component: SingleWithdrawalComponent},
            {path: 'manage_deposits', component: ManageDepositsComponent},
            {path: 'manage_deposits/:ID', component: ManageSingleDepositComponent},
            {path: 'activation/:type', component: WalletActivationComponent},
            {path: 'admin/platform_bank_account', component: PlatformBankAccountComponent},
            {path: 'admin/platform_bank_account/new', component: NewPlatformBankAccountComponent},
            {path: 'ownership', component: OwnershipComponent},
            {path: 'platform_config', component: PlatformConfigComponent},
        ]
    }
];

const routes: Routes = [
    {path: '', pathMatch: 'full', canActivate: [CoopGuard], children: appRoutes},
    {path: ':coopID', canActivate: [CoopGuard], children: appRoutes},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

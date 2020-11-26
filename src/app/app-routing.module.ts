// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { OfferDetailsComponent } from './offers/offer-details/offer-details.component';
import { InvestComponent } from './invest/invest.component';
import { MyPortfolioComponent } from './my-portfolio/my-portfolio.component';
import { InvestmentDetailsComponent } from './investment-details/investment-details.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { NewProposalComponent } from './investment-details/new-proposal/new-proposal.component';
import { FinishNewProposalComponent } from './investment-details/finish-new-proposal/finish-new-proposal.component';
import { ProposalDetailsComponent } from './investment-details/proposal-details/proposal-details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { TxOverviewComponent } from './wallet/tx-overview/tx-overview.component';
import { NewPaymentOptionComponent } from './payment-options/new-payment-option/new-payment-option.component';
import { AuthGuard } from './authentication/auth.guard';
import { CreateOrganizationComponent } from './organizations/create-organization/create-organization.component';
import { ManageOrganizationsComponent } from './organizations/manage-organizations/manage-organizations.component';
import { OrganizationDetailsComponent } from './organizations/organization-details/organization-details.component';
import { CreateNewProjectComponent } from './organizations/organization-details/manage-projects/create-new-project/create-new-project.component';
import { ManageProjectsComponent } from './organizations/organization-details/manage-projects/manage-projects.component';
import { ManageSingleProjectComponent } from './organizations/organization-details/manage-projects/manage-single-project/manage-single-project.component';
import { VerifySignOfferComponent } from './offers/offer-details/verify-sign-offer/verify-sign-offer.component';
import { ManageWithdrawalsComponent } from './manage-withdrawals/manage-withdrawals.component';
import { SingleWithdrawalComponent } from './manage-withdrawals/single-withdrawal/single-withdrawal.component';
import { ManageDepositsComponent } from './manage-deposits/manage-deposits.component';
import { DepositComponent } from './deposit/deposit.component';
import { ManageSingleDepositComponent } from './manage-deposits/manage-single-deposit/manage-single-deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WalletActivationComponent } from './wallet-activation/wallet-activation.component';
import { CompleteOnboardingComponent } from './complete-onboarding/complete-onboarding.component';
import { PlatformBankAccountComponent } from './platform-bank-account/platform-bank-account.component';
import { NewPlatformBankAccountComponent } from './platform-bank-account/new-platform-bank-account/new-platform-bank-account.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { OwnershipComponent } from './ownership/ownership.component';
import { RevenueShareComponent } from './organizations/organization-details/manage-projects/manage-single-project/manage-payments/revenue-share/revenue-share.component';
import { ManagePaymentsComponent } from './organizations/organization-details/manage-projects/manage-single-project/manage-payments/manage-payments.component';
import { OfferDetailsGuard } from './offers/offer-details/offer-details.guard';
import { ProjectWithdrawComponent } from './organizations/organization-details/manage-projects/manage-single-project/project-withdraw/project-withdraw.component';
import { ProjectDepositComponent } from './organizations/organization-details/manage-projects/manage-single-project/project-deposit/project-deposit.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { SignInAutoComponent } from './authentication/sign-in-auto/sign-in-auto.component';
import { IdentityComponent } from './settings/user/identity/identity.component';
import { UserGuard } from './settings/user/user.guard';
import { UserComponent } from './settings/user/user.component';
import { CoopGuard } from './shared/guards/coop.guard';
import { AuthLayoutComponent } from './authentication/auth-layout/auth-layout.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';

const appRoutes: Routes = [
    {
        path: '', component: PublicLayoutComponent,
        children: [
            {path: '', component: LandingPageComponent},
            {
                path: '', component: AuthLayoutComponent, children: [
                    {path: 'sign_up', component: SignUpComponent},
                    {path: 'sign_in', component: SignInComponent},
                    {path: 'forgot_password', component: ForgotPasswordComponent},
                    {path: 'reset_password', component: ResetPasswordComponent},
                ]
            },
            {path: 'overview/:isOverview', component: OffersComponent},
            {path: 'overview/:id/:isOverview', component: OfferDetailsComponent, canActivate: [OfferDetailsGuard]},
            {path: 'sign_in_auto/:email/:password', component: SignInAutoComponent},
        ]
    },
    {
        path: 'dash', component: SecureLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'offers'},
            {path: 'offers', component: OffersComponent},
            {path: 'wallet', component: WalletComponent},
            {path: 'offers/:id', component: OfferDetailsComponent},
            {path: 'offers/:id/invest', component: InvestComponent},
            {path: 'my_portfolio', component: MyPortfolioComponent},
            {path: 'my_portfolio/:id/:inPortfolio', component: InvestmentDetailsComponent},
            {path: 'payment_options', component: PaymentOptionsComponent},
            {path: 'my_portfolio/investment_details/new_proposal', component: NewProposalComponent},
            {path: 'finish_new_proposal', component: FinishNewProposalComponent},
            {path: 'my_portfolio/investment_details/proposal_details', component: ProposalDetailsComponent},
            {path: 'wallet/tx_overview', component: TxOverviewComponent},
            {path: 'payment_options/new', component: NewPaymentOptionComponent},
            {path: 'manage_groups/new', component: CreateOrganizationComponent},
            {
                path: 'settings', children: [
                    {path: 'user', component: UserComponent, canActivate: [UserGuard]},
                    {path: 'user/identity', component: IdentityComponent}
                ]
            },
            {path: 'manage_groups', component: ManageOrganizationsComponent},
            {path: 'manage_groups/:id', component: OrganizationDetailsComponent},
            {path: 'manage_groups/:orgId/create_project', component: CreateNewProjectComponent},
            {path: 'manage_groups/:id/projects', component: ManageProjectsComponent},
            {path: 'manage_groups/:groupID/manage_project/:projectID', component: ManageSingleProjectComponent},
            {path: 'offers/:offerID/invest/:investAmount/verify_sign', component: VerifySignOfferComponent},
            {path: 'manage_groups/:groupID/manage_project/:projectID/manage_payments', component: ManagePaymentsComponent},
            {
                path: 'manage_groups/:groupID/manage_project/:projectID/manage_payments/project_deposit',
                component: ProjectDepositComponent
            },
            {
                path: 'manage_groups/:groupID/manage_project/:projectID/manage_payments/project_withdraw',
                component: ProjectWithdrawComponent
            },
            {
                path: 'manage_groups/:groupID/manage_project/:projectID/manage_payments/revenue_share/:amount',
                component: RevenueShareComponent
            },
            {path: 'manage_withdrawals', component: ManageWithdrawalsComponent},
            {path: 'manage_withdrawals/:ID', component: SingleWithdrawalComponent},
            {path: 'manage_deposits', component: ManageDepositsComponent},
            {path: 'manage_deposits/:ID', component: ManageSingleDepositComponent},
            {path: 'wallet/deposit', component: DepositComponent},
            {path: 'wallet/withdraw', component: WithdrawComponent},
            {path: 'activation/:type', component: WalletActivationComponent},
            {path: 'complete_onboarding', component: CompleteOnboardingComponent},
            {path: 'admin/platform_bank_account', component: PlatformBankAccountComponent},
            {path: 'admin/platform_bank_account/new', component: NewPlatformBankAccountComponent},
            {path: 'exchange', component: ExchangeComponent},
            {path: 'ownership', component: OwnershipComponent},
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

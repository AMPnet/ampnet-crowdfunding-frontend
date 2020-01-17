import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
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
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { AuthGuard } from './authentication/auth.guard';
import { FillDataComponent } from './authentication/sign-up/fill-data/fill-data.component';
import { CreateOrganizationComponent } from './organizations/create-organization/create-organization.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { ManageOrganizationsComponent } from './organizations/manage-organizations/manage-organizations.component';
import { OrganizationDetailsComponent } from './organizations/organization-details/organization-details.component';
import { CreateNewProjectComponent } from './projects/create-new-project/create-new-project.component';
import { MainAdminComponent } from './main-admin/main-admin.component';
import { OnboardingComponent } from './authentication/onboarding/onboarding.component';
import { ManageUsersComponent } from './organizations/manage-users/manage-users.component';
import { DetailsComponent } from './organizations/manage-users/details/details.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { ManageSingleProjectComponent } from './manage-projects/manage-single-project/manage-single-project.component';
import { ApproveOrganizationsComponent } from './organizations/approve-organizations/approve-organizations.component';
import { VerifySignOfferComponent } from './offers/verify-sign-offer/verify-sign-offer.component';
import { RevenueShareComponent } from './project/revenue-share/revenue-share.component';
import { ManageWithdrawalsComponent } from './manage-withdrawals/manage-withdrawals.component';
import { SingleWithdrawalComponent } from './manage-withdrawals/single-withdrawal/single-withdrawal.component';
import { ManageDepositsComponent } from './manage-deposits/manage-deposits.component';
import { DepositComponent } from './deposit/deposit.component';
import { ManageSingleDepositComponent } from './manage-deposits/manage-single-deposit/manage-single-deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WalletActivationComponent } from './wallet-activation/wallet-activation.component';
import { UserActivationComponent } from './wallet-activation/user-activation/user-activation.component';
import { GroupActivationComponent } from './wallet-activation/group-activation/group-activation.component';
import { ProjectActivationComponent } from './wallet-activation/project-activation/project-activation.component';
import { ActivateSignComponent } from './wallet-activation/activate-sign/activate-sign.component';
import { CompleteOnboardingComponent } from './complete-onboarding/complete-onboarding.component';

// Defines public routes accessible to everyone
// (landing page, login, register, contact help, etc...)

// Defines secure routes only accessible to authenticated
// users (dashboard)
const routes: Routes = [
  {
    path: '', component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'sign_up', component: SignUpComponent },
      { path: 'confirm_email', component: ConfirmEmailComponent },
      { path: 'overview/:isOverview', component: OffersComponent },
      { path: 'overview/:id/:isOverview', component: OfferDetailsComponent },
      { path: 'fill_data', component: FillDataComponent },
      { path: 'onboarding', component: OnboardingComponent }
    ]
  },
  {
    path: 'dash', component: SecureLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: OffersComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'offers/:id', component: OfferDetailsComponent },
      { path: 'offers/:id/invest', component: InvestComponent },
      { path: 'my_portfolio', component: MyPortfolioComponent },
      { path: 'my_portfolio/investment_details', component: InvestmentDetailsComponent },
      { path: 'payment_options', component: PaymentOptionsComponent },
      { path: 'my_portfolio/investment_details/new_proposal', component: NewProposalComponent },
      { path: 'finish_new_proposal', component: FinishNewProposalComponent },
      { path: 'my_portfolio/investment_details/proposal_details', component: ProposalDetailsComponent },
      { path: 'wallet/tx_overview', component: TxOverviewComponent },
      { path: 'payment_options/new', component: NewPaymentOptionComponent },
      { path: 'manage_groups/new', component: CreateOrganizationComponent },
      { path: 'general_settings', component: GeneralSettingsComponent },
      { path: 'manage_groups', component: ManageOrganizationsComponent },
      { path: 'manage_groups/:id', component: OrganizationDetailsComponent },
      { path: 'manage_groups/:orgId/create_project', component: CreateNewProjectComponent },
      { path: 'token_management', component: MainAdminComponent },
      { path: 'manage_users', component: ManageUsersComponent },
      { path: 'manage_users/:id', component: DetailsComponent },
      { path: 'manage_groups/:id/projects', component: ManageProjectsComponent },
      { path: 'manage_groups/:groupID/manage_project/:projectID', component: ManageSingleProjectComponent },
      { path: 'approve_organizations', component: ApproveOrganizationsComponent },
      { path: 'offers/:offerID/invest/:investAmount/verify_sign', component: VerifySignOfferComponent },
      { path: 'manage_groups/:groupID/manage_project/:projectID/revenue_share', component: RevenueShareComponent },
      { path: 'manage_withdrawals', component: ManageWithdrawalsComponent },
      { path: 'manage_withdrawals/:ID', component: SingleWithdrawalComponent },
      { path: 'manage_deposits', component: ManageDepositsComponent },
      { path: 'manage_deposits/:ID', component: ManageSingleDepositComponent },
      { path: 'wallet/deposit', component: DepositComponent },
      { path: 'wallet/withdraw', component: WithdrawComponent }, 
      { path: 'activation', component: WalletActivationComponent },
      { path: 'activation/users', component: UserActivationComponent },
      { path: 'activation/groups', component: GroupActivationComponent },
      { path: 'activation/projects', component: ProjectActivationComponent },
      { path: 'activation/:type/:id', component: ActivateSignComponent },
      { path: 'complete_onboarding', component: CompleteOnboardingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

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

// Defines public routes accessible to everyone
// (landing page, login, register, contact help, etc...)


// Defines secure routes only accessible to authenticated
// users (dashboard)
const routes: Routes = [
  { path: '', component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent }
    ]
  },
  { path: 'dash', component: SecureLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: OffersComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'offer_details', component: OfferDetailsComponent },
      { path: 'offer_details/:id/invest', component: InvestComponent },
      { path: 'my_portfolio', component: MyPortfolioComponent },
      { path: 'my_portfolio/investment_details', component: InvestmentDetailsComponent },
      { path: 'payment_options', component: PaymentOptionsComponent },
      { path: 'my_portfolio/investment_details/new_proposal', component: NewProposalComponent },
      { path: 'finish_new_proposal', component: FinishNewProposalComponent },
      { path: 'my_portfolio/investment_details/proposal_details', component: ProposalDetailsComponent },
      { path: 'wallet/tx_overview', component: TxOverviewComponent },
      { path: 'payment_options/new', component: NewPaymentOptionComponent }
    ]
  },
  { path: 'sign_up', component: SignUpComponent },
  { path: 'confirm_email', component: ConfirmEmailComponent },
  { path: 'overview', component: OffersComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

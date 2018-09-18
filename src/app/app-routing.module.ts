import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { OfferDetailsComponent } from './offers/offer-details/offer-details.component';
import { InvestComponent } from './invest/invest.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { InvestmentDetailsComponent } from './investment-details/investment-details.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { NewProposalComponent } from './investment-details/new-proposal/new-proposal.component';
import { FinishNewProposalComponent } from './investment-details/finish-new-proposal/finish-new-proposal.component';
import { ProposalDetailsComponent } from './investment-details/proposal-details/proposal-details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';


// Defines public routes accessible to everyone
// (landing page, login, register, contact help, etc...)
const publicRoutes: Routes = [
  { path: '', component: PublicLayoutComponent,
    children: [
      { path: 'sign_up', component: SignUpComponent },
      { path: '', component: LandingPageComponent }
    ]
  }
];

// Defines secure routes only accessible to authenticated
// users (dashboard)
const secureRoutes: Routes = [
  { path: 'dash', component: SecureLayoutComponent,
    children: [
      { path: '', component: OffersComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'offer_details', component: OfferDetailsComponent },
      { path: 'offer_details/:id/invest', component: InvestComponent },
      { path: 'my_profile', component: MyProfileComponent},
      { path: 'my_profile/investment_details', component: InvestmentDetailsComponent },
      { path: 'payment_options', component: PaymentOptionsComponent },
      { path: 'my_profile/investment_details/new_proposal', component: NewProposalComponent },
      { path: 'finish_new_proposal', component: FinishNewProposalComponent },
      { path: 'proposal_details', component: ProposalDetailsComponent }
    ]
  }
];

const routes: Routes = publicRoutes.concat(secureRoutes);


@NgModule({
  imports: [ RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

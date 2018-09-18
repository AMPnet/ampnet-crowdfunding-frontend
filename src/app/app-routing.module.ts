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
import { DashboardHolderComponent } from './dashboard-holder/dashboard-holder.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'dash/wallet', outlet: 'dash', component: WalletComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'offer_details', component: OfferDetailsComponent },
  { path: 'invest', component: InvestComponent },
  { path: 'my_profile', component: MyProfileComponent},
  { path: 'investment_details', component: InvestmentDetailsComponent },
  { path: 'payment_options', component: PaymentOptionsComponent },
  { path: 'new_proposal', component: NewProposalComponent },
  { path: 'finish_new_proposal', component: FinishNewProposalComponent },
  { path: 'proposal_details', component: ProposalDetailsComponent },
  { path: 'dash', component: DashboardHolderComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

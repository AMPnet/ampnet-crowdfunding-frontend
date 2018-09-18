import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { SingleOfferItemComponent } from './offers/single-offer-item/single-offer-item.component';
import { WalletChartComponent } from './wallet/wallet-chart/wallet-chart.component';
import { WalletTxHistoryComponent } from './wallet/wallet-tx-history/wallet-tx-history.component';
import { OfferDetailsComponent } from './offers/offer-details/offer-details.component';
import { DepositModalComponent } from './wallet/deposit-modal/deposit-modal.component';
import { InvestComponent } from './invest/invest.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SingleInvestItemComponent } from './my-profile/single-invest-item/single-invest-item.component';
import { InvestmentDetailsComponent } from './investment-details/investment-details.component';
import { SingleProposalItemComponent } from './investment-details/single-proposal-item/single-proposal-item.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { FooterComponent } from './footer/footer.component';
import { NewProposalComponent } from './investment-details/new-proposal/new-proposal.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FinishNewProposalComponent } from './investment-details/finish-new-proposal/finish-new-proposal.component';
import { ProposalDetailsComponent } from './investment-details/proposal-details/proposal-details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardHolderComponent } from './dashboard-holder/dashboard-holder.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    OverviewComponent,
    WalletComponent,
    OffersComponent,
    SingleOfferItemComponent,
    WalletChartComponent,
    WalletTxHistoryComponent,
    OfferDetailsComponent,
    DepositModalComponent,
    InvestComponent,
    MyProfileComponent,
    SingleInvestItemComponent,
    InvestmentDetailsComponent,
    SingleProposalItemComponent,
    PaymentOptionsComponent,
    FooterComponent,
    NewProposalComponent,
    FinishNewProposalComponent,
    ProposalDetailsComponent,
    LandingPageComponent,
    DashboardHolderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

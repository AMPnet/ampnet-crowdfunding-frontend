import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DisqusModule } from 'ngx-disqus';

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
import { MyPortfolioComponent } from './my-portfolio/my-portfolio.component';
import { SingleInvestItemComponent } from './my-portfolio/single-invest-item/single-invest-item.component';
import { InvestmentDetailsComponent } from './investment-details/investment-details.component';
import { SingleProposalItemComponent } from './investment-details/single-proposal-item/single-proposal-item.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { FooterComponent } from './footer/footer.component';
import { NewProposalComponent } from './investment-details/new-proposal/new-proposal.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FinishNewProposalComponent } from './investment-details/finish-new-proposal/finish-new-proposal.component';
import { ProposalDetailsComponent } from './investment-details/proposal-details/proposal-details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { HeaderComponent } from './public-layout/header/header.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { TxOverviewComponent } from './wallet/tx-overview/tx-overview.component';
import { LogInModalComponent } from './authentication/log-in-modal/log-in-modal.component';
import { NewPaymentOptionComponent } from './payment-options/new-payment-option/new-payment-option.component';
import { CreditCardInputComponent } from './payment-options/new-payment-option/credit-card-input/credit-card-input.component';
import { BankAccountInputComponent } from './payment-options/new-payment-option/bank-account-input/bank-account-input.component';
import { WithdrawModalComponent } from './wallet/withdraw-modal/withdraw-modal.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('507079277405-o3834fb5jojeq3u9tmm14aobeukg3jmo.apps.googleusercontent.com')
  }
])

export function provideConfig() {
  return config;
}

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem('access_token');
    },
    whitelistedDomains: ['localhost:4200']
  }
}

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
    MyPortfolioComponent,
    SingleInvestItemComponent,
    InvestmentDetailsComponent,
    SingleProposalItemComponent,
    PaymentOptionsComponent,
    FooterComponent,
    NewProposalComponent,
    FinishNewProposalComponent,
    ProposalDetailsComponent,
    LandingPageComponent,
    PublicLayoutComponent,
    SecureLayoutComponent,
    HeaderComponent,
    SignUpComponent,
    TxOverviewComponent,
    LogInModalComponent,
    NewPaymentOptionComponent,
    CreditCardInputComponent,
    BankAccountInputComponent,
    WithdrawModalComponent,
    ConfirmEmailComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    DisqusModule.forRoot('ampnet.disqus.com/embed.js'),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    SocialLoginModule
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

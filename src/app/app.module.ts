import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { DisqusModule } from 'ngx-disqus';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { SingleOfferItemComponent } from './offers/single-offer-item/single-offer-item.component';
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
import { WithdrawModalComponent } from './wallet/withdraw-modal/withdraw-modal.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreateOrganizationComponent } from './organizations/create-organization/create-organization.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { ManageOrganizationsComponent } from './organizations/manage-organizations/manage-organizations.component';
import { OrganizationDetailsComponent } from './organizations/organization-details/organization-details.component';
import { CreateNewProjectComponent } from './projects/create-new-project/create-new-project.component';
import { OnboardingComponent } from './authentication/onboarding/onboarding.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { ManageSingleProjectComponent } from './manage-projects/manage-single-project/manage-single-project.component';
import { VerifySignOfferComponent } from './offers/verify-sign-offer/verify-sign-offer.component';
import { ManagePaymentsComponent } from './project/manage-payments/manage-payments.component';
import { ManageWithdrawalsComponent } from './manage-withdrawals/manage-withdrawals.component';
import { SingleWithdrawalComponent } from './manage-withdrawals/single-withdrawal/single-withdrawal.component';
import { DepositComponent } from './deposit/deposit.component';
import { ManageDepositsComponent } from './manage-deposits/manage-deposits.component';
import { ManageSingleDepositComponent } from './manage-deposits/manage-single-deposit/manage-single-deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { EscapeHtmlPipe } from './pipes/unescape';
import { WalletActivationComponent } from './wallet-activation/wallet-activation.component';
import { UserActivationComponent } from './wallet-activation/user-activation/user-activation.component';
import { GroupActivationComponent } from './wallet-activation/group-activation/group-activation.component';
import { ProjectActivationComponent } from './wallet-activation/project-activation/project-activation.component';
import { CompleteOnboardingComponent } from './complete-onboarding/complete-onboarding.component';
import { SummaryComponent } from './summary/summary.component';
import { PlatformBankAccountComponent } from './platform-bank-account/platform-bank-account.component';
import { NewPlatformBankAccountComponent } from './platform-bank-account/new-platform-bank-account/new-platform-bank-account.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { OwnershipComponent } from './ownership/ownership.component';
import { CurrencyDefaultPipe } from './pipes/currency-default-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RevenueShareComponent } from './revenue-share/revenue-share.component';
import { TxIconType, TxIconStatus } from './wallet/wallet-icon.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProjectTagFilterComponent } from './shared/components/project-tag-filter/project-tag-filter.component';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

const socialAuthServiceConfig = {
    provide: 'SocialAuthServiceConfig',
    useValue: {
        autoLogin: false,
        providers: [
            {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider('507079277405-o3834fb5jojeq3u9tmm14aobeukg3jmo.apps.googleusercontent.com'),
            },
            {
                id: FacebookLoginProvider.PROVIDER_ID,
                provider: new FacebookLoginProvider('293264554869933'),
            },
        ]
    } as SocialAuthServiceConfig
};

export function jwtOptionsFactory() {
    return {
        tokenGetter: () => {
            return localStorage.getItem('access_token');
        },
        whitelistedDomains: ['localhost:4200']
    };
}

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        WalletComponent,
        OffersComponent,
        SingleOfferItemComponent,
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
        WithdrawModalComponent,
        ConfirmEmailComponent,
        CreateOrganizationComponent,
        GeneralSettingsComponent,
        ManageOrganizationsComponent,
        OrganizationDetailsComponent,
        CreateNewProjectComponent,
        OnboardingComponent,
        ManageProjectsComponent,
        ManageSingleProjectComponent,
        VerifySignOfferComponent,
        ManagePaymentsComponent,
        ManageWithdrawalsComponent,
        SingleWithdrawalComponent,
        DepositComponent,
        ManageDepositsComponent,
        ManageSingleDepositComponent,
        WithdrawComponent,
        EscapeHtmlPipe,
        WalletActivationComponent,
        UserActivationComponent,
        GroupActivationComponent,
        ProjectActivationComponent,
        CompleteOnboardingComponent,
        SummaryComponent,
        PlatformBankAccountComponent,
        NewPlatformBankAccountComponent,
        ExchangeComponent,
        OwnershipComponent,
        CurrencyDefaultPipe,
        RevenueShareComponent,
        TxIconType,
        TxIconStatus,
        ProjectTagFilterComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        DisqusModule.forRoot('ampnet.disqus.com/embed.js'),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SocialLoginModule,
        NgxSpinnerModule,
        NgbModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule,
        MatOptionModule,
        MatAutocompleteModule
    ],
    providers: [
        socialAuthServiceConfig,
        {
            provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR',
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

// tslint:disable:max-line-length
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { OfferComponent } from './offers/offer/offer.component';
import { MyPortfolioComponent } from './my-portfolio/my-portfolio.component';
import { SingleInvestItemComponent } from './my-portfolio/single-invest-item/single-invest-item.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule } from 'angularx-social-login';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TxAmountSign } from './wallet/wallet.pipe';
import { UserStateReminderComponent } from './user-state-reminder/user-state-reminder.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LocationMapComponent } from './location-map/location-map.component';
import { MapModalComponent } from './location-map/map-modal/map-modal.component';
import { environment } from '../environments/environment.prod';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { APP_BASE_HREF } from '@angular/common';
import { AppConfigService } from './shared/services/app-config.service';
import { ClickOutsideDirective } from './navbar/directives/click-outside.directive';
import { NgxCaptchaModule } from 'ngx-captcha';
import { QuillModule } from 'ngx-quill';
import { DynamicLocaleProvider } from './shared/providers/locale.provider';
import { SentryProvider } from './shared/providers/sentry.provider';
import { StaticPageComponent } from './static-page/static-page.component';
import { FaIconsService } from './shared/services/fa-icons.service';
import { LanguageService } from './shared/services/language.service';
import { SharedModule } from './shared/shared.module';
import { OfferInvestComponent } from './offers/offer-invest/offer-invest.component';
import { OfferInvestVerifyComponent } from './offers/offer-invest-verify/offer-invest-verify.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectNewComponent } from './projects/project-new/project-new.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { GroupComponent } from './groups/group/group.component';
import { GroupNewComponent } from './groups/group-new/group-new.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { GroupProjectsComponent } from './groups/group-projects/group-projects.component';
import { GroupProjectsItemComponent } from './groups/group-projects-item/group-projects-item.component';
import { ProjectEditPaymentsComponent } from './projects/project-edit-payments/project-edit-payments.component';
import { ProjectRevenueShareComponent } from './projects/project-revenue-share/project-revenue-share.component';
import { ProjectRevenueShareVerifyComponent } from './projects/project-revenue-share-verify/project-revenue-share-verify.component';
import { ProjectDepositComponent } from './projects/project-deposit/project-deposit.component';
import { ProjectWithdrawComponent } from './projects/project-withdraw/project-withdraw.component';
import { OffersItemComponent } from './offers/offers-item/offers-item.component';
import { TranslateStore } from '@ngx-translate/core';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        WalletComponent,
        OffersComponent,
        OffersItemComponent,
        OfferComponent,
        OfferInvestComponent,
        OfferInvestVerifyComponent,
        MyPortfolioComponent,
        SingleInvestItemComponent,
        ProjectsComponent,
        ProjectNewComponent,
        ProjectEditComponent,
        ProjectEditPaymentsComponent,
        ProjectDepositComponent,
        ProjectWithdrawComponent,
        ProjectRevenueShareComponent,
        ProjectRevenueShareVerifyComponent,
        GroupComponent,
        GroupNewComponent,
        GroupEditComponent,
        GroupProjectsComponent,
        GroupProjectsItemComponent,
        FooterComponent,
        LandingPageComponent,
        PublicLayoutComponent,
        SecureLayoutComponent,
        DepositComponent,
        WithdrawComponent,
        UserStateReminderComponent,
        LocationMapComponent,
        MapModalComponent,
        TxAmountSign,
        ClickOutsideDirective,
        StaticPageComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        SharedModule,
        SocialLoginModule,
        NgbModule,
        ModalModule.forRoot(),
        QuillModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgxCaptchaModule,
    ],
    providers: [
        AppConfigService,
        TranslateStore,
        {
            provide: APP_INITIALIZER,
            useFactory: (config: AppConfigService, lang: LanguageService) =>
                () => Promise.resolve()
                    .then(() => config.load().toPromise())
                    .then(() => lang.setLanguage().toPromise()),
            multi: true,
            deps: [AppConfigService, LanguageService]
        },
        {
            provide: APP_BASE_HREF,
            useValue: environment.baseHref,
        },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useValue: 'EUR', // TODO: Set this from app config service.
        },
        DynamicLocaleProvider,
        SentryProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(faIconsService: FaIconsService) {
        faIconsService.addIcons();
    }
}

// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';
import { MyPortfolioComponent } from './my-portfolio/my-portfolio.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { CoopGuard } from './shared/guards/coop.guard';
import { StaticPageComponent } from './static-page/static-page.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { ProjectNewComponent } from './projects/project-new/project-new.component';
import { GroupNewComponent } from './groups/group-new/group-new.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { GroupComponent } from './groups/group/group.component';
import { ProjectsComponent } from './projects/projects.component';
import { OfferComponent } from './offers/offer/offer.component';
import { OfferInvestComponent } from './offers/offer-invest/offer-invest.component';
import { OfferInvestVerifyComponent } from './offers/offer-invest-verify/offer-invest-verify.component';
import { ProjectDepositComponent } from './projects/project-deposit/project-deposit.component';
import { ProjectWithdrawComponent } from './projects/project-withdraw/project-withdraw.component';
import { ProjectRevenueShareComponent } from './projects/project-revenue-share/project-revenue-share.component';
import { NoAuthGuard } from './auth/no-auth.guard';
import { OfferGuard } from './offers/offer/offer.guard';
import { SettingsModule } from './settings/settings.module';

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
                ]
            },
            {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
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

            {path: 'settings', loadChildren: () => SettingsModule},
            {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)}
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

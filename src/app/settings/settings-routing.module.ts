// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsUserComponent } from './user/settings-user.component';
import { IdentityComponent } from './user/identity/identity.component';
import { IdentityGuard } from './user/identity/identity.guard';
import { AcceptTermsComponent } from './user/identity/accept-terms/accept-terms.component';
import { VeriffComponent } from './user/identity/veriff/veriff.component';
import { TermsAcceptedGuard } from './user/identity/accept-terms/terms-accepted.guard';
import { IdentyumComponent } from './user/identity/identyum/identyum.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { NewPaymentOptionComponent } from './payment-options/new-payment-option/new-payment-option.component';

const routes: Routes = [
    {path: 'user', component: SettingsUserComponent},
    {
        path: 'user/identity', component: IdentityComponent, canActivate: [IdentityGuard], children: [
            {path: '', component: AcceptTermsComponent},
            {path: 'veriff', component: VeriffComponent, canActivate: [TermsAcceptedGuard]},
            {path: 'identyum', component: IdentyumComponent, canActivate: [TermsAcceptedGuard]}
        ]
    },
    {path: 'payment_options', component: PaymentOptionsComponent},
    {path: 'payment_options/new', component: NewPaymentOptionComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule {
}

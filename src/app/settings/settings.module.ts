import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AcceptTermsComponent } from './user/identity/accept-terms/accept-terms.component';
import { IdentyumComponent } from './user/identity/identyum/identyum.component';
import { VeriffComponent } from './user/identity/veriff/veriff.component';
import { SettingsUserComponent } from './user/settings-user.component';
import { IdentityComponent } from './user/identity/identity.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { NewPaymentOptionComponent } from './payment-options/new-payment-option/new-payment-option.component';


@NgModule({
    declarations: [
        IdentityComponent,
        AcceptTermsComponent,
        IdentyumComponent,
        VeriffComponent,
        SettingsUserComponent,
        PaymentOptionsComponent,
        NewPaymentOptionComponent
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        SharedModule,
    ]
})
export class SettingsModule {
}

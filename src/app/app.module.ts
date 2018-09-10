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

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    OverviewComponent,
    WalletComponent,
    OffersComponent,
    SingleOfferItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

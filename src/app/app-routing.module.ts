import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { WalletComponent } from './wallet/wallet.component';
import { OffersComponent } from './offers/offers.component';


const routes: Routes = [
	{ path: '', redirectTo: 'overview', pathMatch: 'full' },
	{ path: 'overview', component: OverviewComponent },
	{ path: 'wallet', component: WalletComponent },
	{ path: 'offers', component: OffersComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

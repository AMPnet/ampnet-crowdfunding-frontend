import { Component, OnDestroy, OnInit } from '@angular/core';
import { Portfolio, PortfolioResponse, PortfolioService, PortfolioStats } from '../shared/services/wallet/portfolio.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';


@Component({
    selector: 'app-my-portfolio',
    templateUrl: './my-portfolio.component.html',
    styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent {
    constructor(private portfolioService: PortfolioService,
                private walletService: WalletService) {
    }

    walletActivated$: Observable<boolean> = this.walletService.wallet$.pipe(
        map(wallet => wallet !== WalletState.EMPTY && wallet.hash !== null)
    );

    portfolioStats$ = this.portfolioService.getPortfolioStats().pipe(
        map(stats => {
            if (stats.investments > 0) {
                stats.roi = ((stats.earnings + stats.investments) / (stats.investments) - 1);
            }

            return stats;
        })
    );

    portfolio$: Observable<Portfolio[]> = this.portfolioService.getPortfolio().pipe(
        map(res => res.portfolio)
    );
}

import { Component } from '@angular/core';
import { Portfolio, PortfolioService } from '../shared/services/wallet/portfolio.service';
import { WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { enterTrigger } from '../shared/animations';


@Component({
    selector: 'app-my-portfolio',
    templateUrl: './my-portfolio.component.html',
    styleUrls: ['./my-portfolio.component.scss'],
    animations: [enterTrigger]
})
export class MyPortfolioComponent {
    constructor(private portfolioService: PortfolioService,
                private walletService: WalletService) {
    }

    walletActivated$: Observable<boolean> = this.walletService.wallet$.pipe(
        map(wallet => wallet.state === WalletState.READY)
    );

    portfolioStats$ = this.portfolioService.getPortfolioStats().pipe(
        map(stats => {
            if (stats.investments > 0) {
                stats.roi = ((stats.earnings + stats.investments) / (stats.investments) - 1);
            } else {
                stats.roi = 0;
            }

            return stats;
        })
    );

    portfolio$: Observable<Portfolio[]> = this.portfolioService.getPortfolio().pipe(
        map(res => res.portfolio)
    );
}

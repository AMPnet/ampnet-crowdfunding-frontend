import { Component, OnDestroy } from '@angular/core';
import { WalletDetailsWithState, WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { UserService } from '../shared/services/user/user.service';
import { User, UserRole } from '../shared/services/user/signup.service';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { WebsocketService } from '../shared/services/websocket.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-user-state-reminder',
    templateUrl: './user-state-reminder.component.html',
    styleUrls: ['./user-state-reminder.component.scss']
})
export class UserStateReminderComponent implements OnDestroy {
    wallet$ = this.walletService.wallet$;
    user$ = this.userService.user$;

    userRole = UserRole;

    userWalletSubs: Subscription;
    walletWSSubs: Subscription;

    walletWSSub = new Subject<WalletDetailsWithState>();

    constructor(private walletService: WalletService,
                private websocketService: WebsocketService,
                private userService: UserService) {
        this.userWalletSubs = combineLatest([this.user$, this.wallet$]).pipe(
            tap(([user, wallet]) => {
                if (this.isWalletReady(wallet)) {
                    this.userWalletSubs.unsubscribe();
                    this.walletWSSubs.unsubscribe();
                }

                if (this.isWaitingWalletReady(user, wallet)) {
                    this.userWalletSubs.unsubscribe();
                    this.walletWSSub.next(wallet);
                }
            })
        ).subscribe();

        this.walletWSSubs = this.walletWSSub.asObservable().pipe(
            switchMap(wallet => this.websocketService.walletNotifier(wallet.wallet?.activation_data)),
            tap(() => this.walletService.clearAndRefreshWallet()),
        ).subscribe();
    }

    isUserVerified(user: User): boolean {
        return !user ? true : user.verified;
    }

    isWalletInitialized(wallet: WalletDetailsWithState) {
        return !wallet ? true : wallet.state !== WalletState.EMPTY;
    }

    isWalletReady(wallet: WalletDetailsWithState) {
        return !wallet ? true : wallet.state === WalletState.READY && wallet.wallet.balance !== null;
    }

    isWaitingWalletReady(user: User, wallet: WalletDetailsWithState) {
        return this.isUserVerified(user) && this.isWalletInitialized(wallet) && !this.isWalletReady(wallet);
    }

    ngOnDestroy() {
        this.userWalletSubs.unsubscribe();
        this.walletWSSubs.unsubscribe();
    }
}

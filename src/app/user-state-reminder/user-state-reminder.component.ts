import { Component } from '@angular/core';
import { WalletDetailsWithState, WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { UserService } from '../shared/services/user/user.service';
import { User } from '../shared/services/user/signup.service';

@Component({
    selector: 'app-user-state-reminder',
    templateUrl: './user-state-reminder.component.html',
    styleUrls: ['./user-state-reminder.component.css']
})
export class UserStateReminderComponent {
    wallet$ = this.walletService.wallet$;
    user$ = this.userService.user$;

    constructor(private walletService: WalletService,
                private userService: UserService) {
    }

    isUserVerified(user: User): boolean {
        return !user ? true : user.verified;
    }

    isWalletInitialized(wallet: WalletDetailsWithState) {
        return !wallet ? true : wallet.state !== WalletState.EMPTY;
    }

    isWalletReady(wallet: WalletDetailsWithState) {
        return !wallet ? true : wallet.state === WalletState.READY;
    }
}

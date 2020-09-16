import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { map } from 'rxjs/operators';
import { UserService } from '../shared/services/user/user.service';

@Component({
    selector: 'app-user-state-reminder',
    templateUrl: './user-state-reminder.component.html',
    styleUrls: ['./user-state-reminder.component.css']
})
export class UserStateReminderComponent {
    walletInitialized$: Observable<boolean> = this.walletService.wallet$.pipe(
        map(wallet => wallet !== WalletState.EMPTY)
    );

    userVerified$: Observable<boolean> = this.userService.user$.pipe(
        map(user => user.verified)
    );

    constructor(private walletService: WalletService,
                private userService: UserService) {
    }
}

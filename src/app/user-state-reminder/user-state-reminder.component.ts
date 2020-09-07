import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { map } from 'rxjs/operators';
import { UserService } from '../shared/services/user/user.service';

@Component({
    selector: 'app-user-state-reminder',
    templateUrl: './user-state-reminder.component.html',
    styleUrls: ['./user-state-reminder.component.css']
})
export class UserStateReminderComponent implements OnInit {
    walletInitialized$: Observable<boolean>;
    userVerified$: Observable<boolean>;

    constructor(private walletService: WalletService,
                private userService: UserService) {
    }

    ngOnInit() {
        this.walletService.getUserWallet().subscribe();

        this.walletInitialized$ = this.walletService.walletChange$.pipe(
            map(wallet => wallet !== null)
        );

        this.userService.getOwnProfile().subscribe();

        this.userVerified$ = this.userService.userChange$.pipe(
            map(user => user.verified)
        );
    }
}

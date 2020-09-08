import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { map, switchMap } from 'rxjs/operators';
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
        this.walletInitialized$ = this.walletService.getUserWallet().pipe(
            switchMap(_ => this.walletService.walletChange$),
            map(wallet => wallet !== null)
        );

        this.userVerified$ = this.userService.getOwnProfile().pipe(
            switchMap(_ => this.userService.userChange$),
            map(user => user.verified)
        );
    }
}

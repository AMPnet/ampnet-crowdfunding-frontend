import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserService } from '../shared/services/user/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserRole } from '../shared/services/user/signup.service';
import { WalletDetailsWithState, WalletService, WalletState } from '../shared/services/wallet/wallet.service';
import { version } from '../../../package.json';
import { UserAuthService } from '../shared/services/user/user-auth.service';
import { WalletDetails } from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
    appVersion: string = version;
    userRole = UserRole;

    user$ = this.userService.user$;
    wallet$ = this.walletService.wallet$;

    constructor(private router: Router,
                private userService: UserService,
                private userAuthService: UserAuthService,
                private walletService: WalletService) {
    }

    ngAfterViewInit() {
        $('#main-menu li').on('click', () => {
            NavbarComponent.toggleSidebar(false);
        });
    }

    onLogout() {
        this.userAuthService.logout();
        this.router.navigate(['']);
    }

    isWalletReady(wallet: WalletDetailsWithState) {
        return !wallet ? false : wallet.state === WalletState.READY;
    }
}

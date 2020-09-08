import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserService } from '../shared/services/user/user.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserRole } from '../shared/services/user/signup.service';
import { WalletService } from '../shared/services/wallet/wallet.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    userRole = UserRole;

    userChange$: Observable<User>;
    walletInitialized$: Observable<boolean>;

    constructor(private router: Router,
                private userService: UserService,
                private walletService: WalletService) {
    }

    ngOnInit() {
        $('#main-menu li').on('click', () => {
            NavbarComponent.toggleSidebar(false);
        });

        this.userService.getOwnProfile().subscribe();
        this.userChange$ = this.userService.userChange$;

        this.walletService.getUserWallet().subscribe();
        this.walletInitialized$ = this.walletService.walletChange$.pipe(
            map(wallet => wallet !== null)
        );
    }

    logOutClicked() {
        return this.userService.logout().subscribe(() => {
            this.router.navigate(['']);
        });
    }
}

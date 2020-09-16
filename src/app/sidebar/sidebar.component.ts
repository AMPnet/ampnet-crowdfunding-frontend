import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserService } from '../shared/services/user/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserRole } from '../shared/services/user/signup.service';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { version } from '../../../package.json';
import { UserAuthService } from '../shared/services/user/user-auth.service';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
    appVersion: string = version;
    userRole = UserRole;

    user$: Observable<User>;
    walletInitialized$: Observable<boolean>;

    constructor(private router: Router,
                private userService: UserService,
                private userAuthService: UserAuthService,
                private walletService: WalletService) {
    }

    ngOnInit() {
        this.user$ = this.userService.user$;

        this.walletInitialized$ = this.walletService.wallet$.pipe(
            map(wallet => wallet !== null)
        );
    }

    ngAfterViewInit() {
        $('#main-menu li').on('click', () => {
            NavbarComponent.toggleSidebar(false);
        });
    }

    onLogout() {
        return this.userAuthService.logout().subscribe(() => {
            this.router.navigate(['']);
        });
    }
}

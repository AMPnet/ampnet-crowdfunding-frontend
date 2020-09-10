import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserService } from '../shared/services/user/user.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User, UserRole } from '../shared/services/user/signup.service';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { version } from '../../../package.json';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
    appVersion: string = version;

    userRole = UserRole;

    userChange$: Observable<User>;
    walletInitialized$: Observable<boolean>;

    constructor(private router: Router,
                private userService: UserService,
                private walletService: WalletService) {
    }

    ngOnInit() {
        this.userChange$ = this.userService.getOwnProfile().pipe(
            switchMap(_ => this.userService.userChange$)
        );

        this.walletInitialized$ = this.walletService.getUserWallet().pipe(
            switchMap(_ => this.walletService.walletChange$),
            map(wallet => wallet !== null)
        );
    }

    ngAfterViewInit() {
        $('#main-menu li').on('click', () => {
            NavbarComponent.toggleSidebar(false);
        });
    }

    logOutClicked() {
        return this.userService.logout().subscribe(() => {
            this.router.navigate(['']);
        });
    }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserService } from '../shared/services/user/user.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    isAdmin: boolean;
    isPlatformManager: boolean;
    isTokenIssuer: boolean;
    hasWalletActive = true;
    hasBankingInfo = true;
    hasVerifiedProfile = true;
    fullName: string;

    constructor(private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
        $('#main-menu li').on('click', () => {
            NavbarComponent.toggleSidebar(false);
        });
        this.getProfile();
        this.fetchUserData();
        this.userService.userChange$.subscribe(user => {
            this.hasVerifiedProfile = user.verified;
            console.log(this.hasVerifiedProfile);
        });
    }

    getProfile() {
        SpinnerUtil.showSpinner();
        this.userService.getOwnProfile().subscribe( (res: any)  => {
            this.isAdmin = (res.role === 'ADMIN');
            this.isPlatformManager = (res.role === 'PLATFORM_MANAGER');
            this.isTokenIssuer = (res.role === 'TOKEN_ISSUER');
        }, hideSpinnerAndDisplayError);
    }

    logOutClicked() {
        return this.userService.logout().subscribe(() => {
            localStorage.removeItem('access_token');
            this.router.navigate(['']);
        });
    }

    contactUsClicked() {
        window.location.href = 'mailto://info@ampnet.io';
    }

    fetchUserData() {
        this.userService.getOwnProfile().subscribe(res => {
            this.fullName = res['first_name'] + ' ' + res['last_name'];
            this.hasVerifiedProfile = res['verified'];
        });
    }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { RouterService } from '../shared/services/router.service';
import { UserService } from '../shared/services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService,
                private router: RouterService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.userService.isLoggedIn()) {
            this.userService.logout();
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}

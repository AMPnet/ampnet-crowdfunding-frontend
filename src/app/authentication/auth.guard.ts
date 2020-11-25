import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../shared/services/user/user-auth.service';
import { AppConfigService } from '../shared/services/app-config.service';
import { RouterService } from '../shared/services/router.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private userAuthService: UserAuthService,
                private router: RouterService) {
    }
    canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.userAuthService.isLoggedIn()) {
            this.userAuthService.logout();
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}

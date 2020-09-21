import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../../shared/services/user/user-auth.service';

@Injectable({
    providedIn: 'root'
})
export class OfferDetailsGuard implements CanActivate {
    constructor(private userAuthService: UserAuthService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.userAuthService.isLoggedIn()) {
            console.log(route.params);
            const projectUUID = route.params.id;
            this.router.navigate([`/dash/offers/${projectUUID}`]);
            return false;
        }

        return true;
    }
}

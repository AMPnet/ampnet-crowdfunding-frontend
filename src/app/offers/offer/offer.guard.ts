import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RouterService } from '../../shared/services/router.service';
import { UserService } from '../../shared/services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class OfferGuard implements CanActivate {
    constructor(private userService: UserService,
                private router: RouterService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.userService.isLoggedIn()) {
            const projectUUID = route.params.id;
            this.router.navigate([`/dash/offers/${projectUUID}`]);
            return false;
        }

        return true;
    }
}

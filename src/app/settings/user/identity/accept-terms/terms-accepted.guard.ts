import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { RouterService } from '../../../../shared/services/router.service';

@Injectable({
    providedIn: 'root'
})
export class TermsAcceptedGuard implements CanActivate {
    constructor(private router: RouterService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentState = this.router.router.getCurrentNavigation().extras.state;
        if (currentState?.termsAccepted !== 'accepted') {
            this.router.navigate(['/dash/settings/user/identity']);
            return false;
        }

        return true;
    }
}

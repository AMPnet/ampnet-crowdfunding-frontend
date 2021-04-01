import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { RouterService } from '../shared/services/router.service';
import { UserService } from '../shared/services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(private userService: UserService,
                private router: RouterService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.userService.isLoggedIn()) {
            this.tryAuthorizedRoute(state.url);
            return false;
        }

        return true;
    }

    tryAuthorizedRoute(url: string) {
        const urlTree = this.router.router.parseUrl(url);
        urlTree.root.children.primary?.segments?.splice(1, 0, new UrlSegment('dash', {}));
        this.router.router.navigate([`/${urlTree.toString()}`]);
    }
}

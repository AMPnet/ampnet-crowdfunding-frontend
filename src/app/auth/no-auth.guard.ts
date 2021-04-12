import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { RouterService } from '../shared/services/router.service';
import { BackendHttpClient } from '../shared/services/backend-http-client.service';
import { JwtTokenService } from '../shared/services/jwt-token.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(private http: BackendHttpClient,
                private jwtTokenService: JwtTokenService,
                private router: RouterService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.jwtTokenService.isLoggedIn()) {
            this.tryAuthorizedRoute(state.url);
            return false;
        }

        return true;
    }

    tryAuthorizedRoute(url: string) {
        const urlTree = this.router.router.parseUrl(url);
        urlTree.root.children.primary?.segments?.splice(1, 0, new UrlSegment('dash', {}));
        this.router.router.navigate([`${urlTree.toString()}`]);
    }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { RouterService } from '../shared/services/router.service';
import { BackendHttpClient } from '../shared/services/backend-http-client.service';
import { JwtTokenService } from '../shared/services/jwt-token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private http: BackendHttpClient,
                private jwtTokenService: JwtTokenService,
                private router: RouterService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.jwtTokenService.isLoggedIn()) {
            this.http.logout().subscribe();
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, DefaultUrlSerializer, RouterStateSnapshot, UrlTree } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';
import { AppConfigService } from '../services/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class CoopGuard implements CanActivate {
    constructor(private appConfig: AppConfigService,
                private router: RouterService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return of(this.appConfig.config.hostname).pipe(
            switchMap(hostname => hostname ? of(true) : this.noHostnameProcedure(route))
        );
    }

    private noHostnameProcedure(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.appConfig.load(route.params.coopID || '').pipe(
            switchMap(config => {
                if (!config.identifier) {
                    return of(false).pipe(tap(() => this.router.router.navigate([`/${config.identifier}`])));
                } else if (config.identifier !== route.params.coopID) {
                    return of(false).pipe(tap(() => this.router.navigateCoop(['/'])));
                } else {
                    return of(true);
                }
            })
        );
    }
}

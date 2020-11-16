import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, DefaultUrlSerializer, RouterStateSnapshot, UrlTree } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(private userService: UserService, private router: RouterService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return combineLatest([this.userService.user$]).pipe(
            map(([latestUser]) => latestUser), take(1),
            map(user => user.verified),
            switchMap(isVerified => isVerified ? of(true) :
                of(false).pipe(tap(() => this.router.navigate(['/dash/settings/user/identity']))))
        );
    }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, DefaultUrlSerializer, RouterStateSnapshot, UrlTree } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(private userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return combineLatest([this.userService.user$]).pipe(
            map(([latestUser]) => latestUser), take(1),
            map(user => user.verified),
            map(isVerified => isVerified ? true : new DefaultUrlSerializer().parse('/dash/settings/user/identity'))
        );
    }
}

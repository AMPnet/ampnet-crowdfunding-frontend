import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';
import { UserService } from '../../shared/services/user/user.service';

@Component({
    selector: 'app-sign-in-auto',
    template: ''
})
export class SignInAutoComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private router: RouterService,
                private errorService: ErrorService,
                private userService: UserService) {
    }

    ngOnInit() {
        const email = this.route.snapshot.params.email;
        const password = this.route.snapshot.params.password;

        if (!email || !password) {
            this.navigateHome();
        }

        this.userService.emailLogin(email, password).pipe(
            this.errorService.handleError,
            catchError(() => {
                this.navigateHome();
                return EMPTY;
            }),
            tap(() => this.router.navigate(['/dash']))
        ).subscribe();
    }

    navigateHome() {
        this.router.navigate(['/']);
    }
}

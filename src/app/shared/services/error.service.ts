import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PopupService } from './popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from './router.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    constructor(private popupService: PopupService,
                private router: RouterService,
                private translate: TranslateService) {
    }

    get handleError() {
        return (source: Observable<unknown>) =>
            source.pipe(this.processError());
    }

    get displayError() {
        return (source: Observable<unknown>) =>
            source.pipe(this.processError(true, false));
    }

    private processError(shouldDisplay = true, shouldTakeAction = true) {
        return catchError(err => {
            const errorRes = err as HttpErrorResponse;
            let display$: Observable<unknown>;
            let action$: Observable<unknown>;

            if (errorRes.error instanceof ErrorEvent) { // client-side error
                return throwError(err);
            } else {  // server-side error
                const error = errorRes.error as BackendError;

                if (error.err_code === AuthError.INVALID_CREDENTIALS) {
                    display$ = this.displayMessage('errors.auth.invalid_credentials');

                    // TODO: just example, use it elsewhere
                    // action$ = this.takeAction(() => this.router.navigate(['/']));
                }
            }

            return of('').pipe(
                switchMap(() => shouldDisplay && display$ ? display$ : of('')),
                switchMap(() => {
                    if (shouldTakeAction) {
                        return action$ ? action$ : EMPTY;
                    } else {
                        return throwError(err);
                    }
                })
            );
        });
    }

    private takeAction<T>(source: () => Observable<T> | Promise<T>): Observable<T> {
        return of('').pipe(switchMap(source));
    }

    private displayMessage(translationKey: string) {
        return this.popupService.error(this.translate.instant(translationKey));
    }
}

interface BackendError {
    description: string;
    message: string;
    err_code: string;
    errors: { [key: string]: string };
}

enum AuthError {
    INVALID_CREDENTIALS = '0207'
}

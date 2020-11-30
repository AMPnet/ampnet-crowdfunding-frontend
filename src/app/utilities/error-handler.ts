import swal, { SweetAlertOptions } from 'sweetalert2';
import { SpinnerUtil } from './spinner-utilities';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ErrorHandler } from '@angular/core';

export function displayBackendError(resp: any) {
    const error = resp.error;

    const defaultSettings: SweetAlertOptions = {
        titleText: 'Warning!',
        type: 'warning',
        customClass: 'popup-warning',
        position: 'top'
    };

    if (error === null) {
        return;
    }

    if (error.description !== undefined) {
        swal(Object.assign(defaultSettings, {text: error.description}));
    } else if (error.message !== undefined) {
        swal(Object.assign(defaultSettings, {text: error.message}));
    } else {
        swal({
            titleText: 'Error!',
            text: 'An unknown error occurred.',
            type: 'error',
            customClass: 'popup-error',
            position: 'top'
        });
    }
}

export function hideSpinnerAndDisplayError(err: any) {
    SpinnerUtil.hideSpinner();
    displayBackendError(err);
}

export function displayBackendErrorRx<T>(): (source: Observable<T>) => Observable<T> {
    return catchError(err => {
        displayBackendError(err);
        return throwError(err);
    });
}

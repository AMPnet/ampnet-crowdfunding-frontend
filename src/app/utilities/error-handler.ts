import swal from 'sweetalert2';
import { SpinnerUtil } from './spinner-utilities';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export function displayBackendError(resp: any) {
    const error = resp.error;

    if (error === null) {
        return;
    }

    if (error.message !== undefined) {
        swal('', error.message, 'warning');
    } else if (error.description !== undefined) {
        swal('', error.description, 'warning');
    } else {
        swal('', 'An unknown error occurred.', 'error');
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

import swal from 'sweetalert2';
import { SpinnerUtil } from './spinner-utilities';

export function displayBackendError(resp: any) {

    const error = resp.error;

    if (error.description !== undefined) {
        swal('', error.description, 'warning');
    } else if (error.message !== undefined) {
        swal('', error.message, 'warning');
    } else {
        swal('', 'An unknown error occurred.', 'error');
    }
}

export function displayErrorMessage(msg: string) {
    swal('', msg, 'error');
}

export function hideSpinnerAndDisplayError(err: any) {
    SpinnerUtil.hideSpinner();
    displayBackendError(err);
}

import swal from "sweetalert2";
import { SpinnerUtil } from "./spinner-utilities";

export function displayBackendError(err: any) {
    swal('', err.error.message, 'warning');
}

export function hideSpinnerAndDisplayError(err: any) {
    SpinnerUtil.hideSpinner()
    displayBackendError(err)
}
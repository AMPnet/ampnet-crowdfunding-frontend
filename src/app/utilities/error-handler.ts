import swal from "sweetalert2";
import { SpinnerUtil } from "./spinner-utilities";

export function displayBackendError(err: any) {
    if(err.error.message != undefined) {
        swal('', err.error.message, 'warning');
    } else {
        console.log("UNHANDLED ERROR!")
        console.log(err)
        swal("", "An unknown error occurred.", "error")
    }
}

export function displayErrorMessage(msg: string) {
    swal('', msg, "error")
}

export function hideSpinnerAndDisplayError(err: any) {
    SpinnerUtil.hideSpinner()
    displayBackendError(err)
}
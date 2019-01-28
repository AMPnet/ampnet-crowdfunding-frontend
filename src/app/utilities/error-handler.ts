import swal from "sweetalert2";

export function displayBackendError(err: any) {
    swal('', err.error.message, 'warning');
}
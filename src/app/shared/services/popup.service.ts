import { Injectable } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    constructor() {
    }

    new(options: SweetAlertOptions): Observable<SweetAlertResult> {
        return from(swal({...options, ...this.setDefaultOptions(options)}));
    }

    info(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'info',
            titleText: 'Info',
            text: message,
            footer: footer,
            customClass: 'popup-info',
            position: 'top'
        }));
    }

    success(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'success',
            titleText: 'Success!',
            text: message,
            footer: footer,
            customClass: 'popup-success',
            position: 'top',
            confirmButtonText: 'Continue <i class="fas fa-arrow-right ml-3"></i>'
        }));
    }

    warning(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'warning',
            titleText: 'Warning!',
            text: message,
            footer: footer,
            customClass: 'popup-warning',
            position: 'top'
        }));
    }

    error(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'error',
            titleText: 'Error!',
            text: message,
            footer: footer,
            customClass: 'popup-error',
            position: 'top'
        }));
    }

    setDefaultOptions(options: SweetAlertOptions): SweetAlertOptions {
        const defaults: SweetAlertOptions = {
            position: 'top',
            customClass: '',
            confirmButtonText: 'Ok'
        };
        defaults.customClass = `popup-${options.type}`;

        if (options.type === 'success') {
            defaults.confirmButtonText = 'Continue <i class="fas fa-arrow-right ml-3"></i>';
        }
        return (defaults);
    }
}

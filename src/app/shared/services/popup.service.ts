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
        return from(swal(options));
    }

    info(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'info',
            titleText: 'Info',
            text: message,
            footer: footer
        }));
    }

    success(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'info',
            titleText: 'Success',
            text: message,
            footer: footer
        }));
    }
}

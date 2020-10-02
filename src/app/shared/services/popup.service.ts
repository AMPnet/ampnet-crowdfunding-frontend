import { Injectable } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    constructor() {
    }

    info(message: string, footer?: string): Observable<SweetAlertResult> {
        // return from(swal('Info', message, 'info'));

        return from(swal({
            titleText: 'Info',
            text: message,
            footer: footer
        }));
    }

    new(options: SweetAlertOptions): Observable<SweetAlertResult> {
        return from(swal(options));
    }
}

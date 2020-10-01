import { Injectable } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    constructor() {
    }

    info(message: string): Observable<SweetAlertResult> {
        return from(swal('Info', message, 'info'));
    }

    new(options: SweetAlertOptions): Observable<SweetAlertResult> {
        return from(swal(options));
    }
}

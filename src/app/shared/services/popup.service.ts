import { Injectable } from '@angular/core';
import swal, { SweetAlertResult } from 'sweetalert2';
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
}

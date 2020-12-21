import { Injectable } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { from, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    constructor(private translate: TranslateService) {
    }

    new(options: SweetAlertOptions): Observable<SweetAlertResult> {
        return from(swal({...this.setDefaultOptions(options), ...options}));
    }

    info(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'info',
            titleText: this.translate.instant('general.popup.info.title'),
            text: message,
            footer: footer,
            customClass: 'popup-info',
            position: 'top'
        }));
    }

    success(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'success',
            titleText: this.translate.instant('general.popup.success.title'),
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
            titleText: this.translate.instant('general.popup.warning.title'),
            text: message,
            footer: footer,
            customClass: 'popup-warning',
            position: 'top'
        }));
    }

    error(message: string, footer?: string): Observable<SweetAlertResult> {
        return from(swal({
            type: 'error',
            titleText: this.translate.instant('general.popup.error.title'),
            text: message,
            footer: footer,
            customClass: 'popup-error',
            position: 'top'
        }));
    }

    private setDefaultOptions(options: SweetAlertOptions): SweetAlertOptions {
        const defaults: SweetAlertOptions = {
            position: 'top',
            customClass: '',
            confirmButtonText: this.translate.instant('general.popup.confirm')
        };
        switch (options.type) {
            case 'error':
                defaults.customClass = 'popup-error';
                break;
            case 'info':
                defaults.customClass = 'popup-info';
                break;
            case 'warning':
                defaults.customClass = 'popup-warning';
                break;
            default:
                defaults.customClass = 'popup-success';
                defaults.confirmButtonText =
                    `${this.translate.instant('general.popup.success.confirm')} <i class="fas fa-arrow-right ml-3"></i>` ;
        }
        return defaults;
    }
}

import { Injectable } from '@angular/core';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { AppConfigService } from './app-config.service';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CaptchaService {
    constructor(private reCaptchaService: ReCaptchaV3Service,
                private appConfig: AppConfigService) {
    }

    getToken(action: CaptchaAction): Observable<string> {
        return from(this.reCaptchaService.executeAsPromise(
            this.appConfig.config.config.reCaptchaSiteKey,
            action, {useGlobalDomain: false}
        ));
    }
}

export enum CaptchaAction {
    SIGN_UP = 'SIGN_UP',
    NEW_INSTANCE = 'NEW_INSTANCE',
}

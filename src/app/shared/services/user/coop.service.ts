import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { AppConfig, CustomConfig } from '../app-config.service';
import { CaptchaAction, CaptchaService } from '../captcha.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CoopService {
    constructor(private http: BackendHttpClient,
                private captchaService: CaptchaService) {
    }

    createCoop(data: CreateCoopData, logo: File) {
        return this.captchaService.getToken(CaptchaAction.NEW_INSTANCE).pipe(
            switchMap(captchaToken => {
                const reqData: CreateCoopReqData = {
                    ...data,
                    re_captcha_token: captchaToken
                };

                const formData = new FormData();

                formData.append('logo', logo, 'logo.png');

                formData.append('request', new Blob([JSON.stringify(reqData)], {
                    type: 'application/json'
                }), 'request.json');

                return this.http.post<AppConfig>(`/api/user/coop`, formData, true);
            }));
    }

    updateCoop(data: UpdateCoopData, logo: File) {
        const removeEmpty = (obj) => {
            Object.keys(obj).forEach(key => {
                if (obj[key] && typeof obj[key] === 'object') {
                    removeEmpty(obj[key]);
                    if (Object.keys(obj[key]).length === 0) {
                        delete obj[key];
                    }
                } else if ([undefined, null, ''].includes(obj[key])) {
                    delete obj[key];
                }
            });
            return obj;
        };

        const formData = new FormData();

        if (logo) {
            formData.append('logo', logo, 'logo.png');
        }

        formData.append('request', new Blob([JSON.stringify(removeEmpty(data))], {
            type: 'application/json'
        }), 'request.json');

        return this.http.put<AppConfig>(`/api/user/coop`, formData);
    }

    getCoop() {
        return this.http.get<AppConfig>(`/api/user/coop`);
    }
}

export interface CreateCoopData {
    identifier: string;
    name: string;
    hostname?: string;
    config?: CustomConfig;
}

interface CreateCoopReqData extends CreateCoopData {
    re_captcha_token: string;
}

interface UpdateCoopData {
    name: string;
    hostname: string;
    need_user_verification: boolean;
    config: CustomConfig;
}

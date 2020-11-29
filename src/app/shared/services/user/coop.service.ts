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

    createCoop(data: CreateCoopData) {
        return this.captchaService.getToken(CaptchaAction.NEW_INSTANCE).pipe(
            switchMap(captchaToken =>
                this.http.post<AppConfig>(`/api/user/coop`, <CreateCoopReqData>{
                    ...data,
                    re_captcha_token: captchaToken
                }, true)
            ));
    }

    updateCoop(data: UpdateCoopData) {
        return this.http.put<AppConfig>(`/api/user/coop`, data);
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
    config: CustomConfig;
}

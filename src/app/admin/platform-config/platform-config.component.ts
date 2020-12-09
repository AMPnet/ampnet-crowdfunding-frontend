import { Component } from '@angular/core';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { CoopService } from '../../shared/services/user/coop.service';
import { AppConfig, AppConfigService } from '../../shared/services/app-config.service';

@Component({
    selector: 'app-platform-config',
    templateUrl: './platform-config.component.html',
    styleUrls: ['./platform-config.component.css']
})
export class PlatformConfigComponent {
    private refreshAppConfig = new BehaviorSubject<AppConfig>(null);
    appConfig$: Observable<AppConfig>;
    updateForm$: Observable<FormGroup>;

    constructor(private coopService: CoopService,
                private appConfigService: AppConfigService,
                private fb: FormBuilder) {
        this.appConfig$ = this.refreshAppConfig.pipe(
            switchMap(appConfig => appConfig !== null ? of(appConfig) : this.coopService.getCoop()),
            shareReplay(1)
        );

        this.updateForm$ = this.appConfig$.pipe(map(appConfig => {
                return fb.group({
                    name: [appConfig.name, Validators.required],
                    title: [appConfig.config?.title],
                    logo: [null],
                    icon: [appConfig.config?.icon_url],
                    hostname: [appConfig.hostname],
                    arkaneID: [appConfig.config?.arkane?.id],
                    arkaneEnv: [appConfig.config?.arkane?.env],
                    needUserVerification: [appConfig.need_user_verification],
                    reCaptchaSiteKey: [appConfig.config?.reCaptchaSiteKey],
                    googleClientID: [appConfig.config?.googleClientId],
                    facebookAppID: [appConfig.config?.facebookAppId],
                });
            })
        );
    }

    updateAppConfig(form: FormGroup) {
        return () => {
            const appConfig = form.value;
            return this.coopService.updateCoop({
                name: appConfig.name,
                hostname: appConfig.hostname,
                need_user_verification: appConfig.needUserVerification,
                config: {
                    title: appConfig.title,
                    icon_url: appConfig.icon,
                    arkane: {
                        id: appConfig.arkaneID,
                        env: appConfig.arkaneEnv,
                    },
                    googleClientId: appConfig.googleClientID,
                    facebookAppId: appConfig.facebookAppID,
                    reCaptchaSiteKey: appConfig.reCaptchaSiteKey
                }
            }, appConfig.logo).pipe(
                displayBackendErrorRx(),
                tap(newAppConfig => {
                    form.get('logo').reset();
                    this.appConfigService.config = newAppConfig;
                    this.refreshAppConfig.next(newAppConfig);
                })
            );
        };
    }
}

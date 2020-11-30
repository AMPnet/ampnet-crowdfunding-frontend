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
                    title: [appConfig.config?.title || undefined],
                    logo: [appConfig.config?.logo_url || undefined],
                    icon: [appConfig.config?.icon_url || undefined],
                    hostname: [appConfig.hostname || undefined],
                    arkaneID: [appConfig.config?.arkane?.id || undefined],
                    arkaneEnv: [appConfig.config?.arkane?.env || undefined],
                    googleClientID: [appConfig.config?.googleClientId || undefined],
                    facebookAppID: [appConfig.config?.facebookAppId || undefined],
                    reCaptchaSiteKey: [appConfig.config?.reCaptchaSiteKey || undefined],
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
                config: {
                    title: appConfig.title,
                    logo_url: appConfig.logo,
                    icon_url: appConfig.icon,
                    arkane: {
                        id: appConfig.arkaneID,
                        env: appConfig.arkaneEnv,
                    },
                    googleClientId: appConfig.googleClientID,
                    facebookAppId: appConfig.facebookAppID,
                    reCaptchaSiteKey: appConfig.reCaptchaSiteKey
                }
            }).pipe(
                displayBackendErrorRx(),
                tap(newAppConfig => {
                    this.appConfigService.config = newAppConfig;
                    this.refreshAppConfig.next(newAppConfig);
                })
            );
        };
    }
}

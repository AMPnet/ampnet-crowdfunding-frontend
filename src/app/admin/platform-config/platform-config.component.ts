import { Component } from '@angular/core';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CoopService } from '../../shared/services/user/coop.service';
import { AppConfig, AppConfigService, KYCProvider } from '../../shared/services/app-config.service';
import { ErrorService } from '../../shared/services/error.service';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../shared/services/language.service';

@Component({
    selector: 'app-platform-config',
    templateUrl: './platform-config.component.html',
    styleUrls: ['./platform-config.component.scss']
})
export class PlatformConfigComponent {
    kycProviders = Object.entries(KYCProvider).map(keyValue => keyValue[1]);

    showSecureConfig: boolean;
    private refreshAppConfig = new BehaviorSubject<AppConfig>(null);
    appConfig$: Observable<AppConfig>;
    updateForm$: Observable<FormGroup>;

    constructor(private route: ActivatedRoute,
                private coopService: CoopService,
                private appConfigService: AppConfigService,
                private errorService: ErrorService,
                private languageService: LanguageService,
                private fb: FormBuilder) {
        this.showSecureConfig = !!this.route.snapshot.queryParams.secure;
        this.appConfig$ = this.refreshAppConfig.pipe(
            switchMap(appConfig => appConfig !== null ? of(appConfig) : this.coopService.getCoop()),
            shareReplay(1)
        );

        this.updateForm$ = this.appConfig$.pipe(map(appConfig => {
                return fb.group({
                    name: [appConfig.name, Validators.required],
                    title: [appConfig.config?.title],
                    logo: [null],
                    banner: [null],
                    icon: [appConfig.config?.icon_url],
                    coop_statute: [appConfig.config?.coop_statute_url],
                    contact_url: [appConfig.config?.contact_url],
                    languages: [appConfig.config?.languages?.config, this.langsPattern],
                    languagesFallback: [appConfig.config?.languages?.fallback],
                    footerHTML: [appConfig.config?.footerHTML],
                    hostname: [appConfig.hostname],
                    arkaneID: [appConfig.config?.arkane?.id],
                    arkaneEnv: [appConfig.config?.arkane?.env],
                    needUserVerification: [appConfig.need_user_verification],
                    kycProvider: [appConfig.kyc_provider],
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
                kyc_provider: appConfig.kycProvider,
                config: {
                    title: appConfig.title,
                    icon_url: appConfig.icon,
                    coop_statute_url: appConfig.coop_statute,
                    contact_url: appConfig.contact_url,
                    languages: {
                        config: appConfig.languages,
                        fallback: appConfig.languagesFallback,
                    },
                    footerHTML: appConfig.footerHTML,
                    arkane: {
                        id: appConfig.arkaneID,
                        env: appConfig.arkaneEnv,
                    },
                    googleClientId: appConfig.googleClientID,
                    facebookAppId: appConfig.facebookAppID,
                    reCaptchaSiteKey: appConfig.reCaptchaSiteKey
                }
            }, appConfig.logo, appConfig.banner).pipe(
                this.errorService.handleError,
                tap(newAppConfig => {
                    form.get('logo').reset();
                    form.get('banner').reset();
                    this.appConfigService.config = newAppConfig;
                    this.refreshAppConfig.next(newAppConfig);
                })
            );
        };
    }

    private get langsPattern(): ValidatorFn {
        return (c: FormControl) => {
            const langsLen = this.languageService.extractLanguages(c.value).length;
            const langGroupsLen = String(c.value || '')
                .trim().split(' ').filter(v => v !== '').length;
            return langsLen === langGroupsLen ? null : {invalid: true};
        };
    }
}

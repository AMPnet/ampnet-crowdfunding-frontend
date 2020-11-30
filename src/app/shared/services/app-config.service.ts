import { Injectable } from '@angular/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { merge as _merge } from 'lodash';

@Injectable()
export class AppConfigService {
    private appConfig: AppConfig;
    private appConfigSubject = new ReplaySubject<AppConfig>(1);

    private readonly hostname = window.location.hostname;
    private readonly localStorageKey = 'app_config';
    private readonly cacheTimeoutMinutes = 1; // TODO: after testing, set back to 10

    constructor(private http: HttpClient) {
    }

    /**
     * Gets application configuration.
     * This is loaded in runtime when the application starts.
     */
    get config(): AppConfig {
        return this.appConfig;
    }

    set config(appConfig: AppConfig) {
        of(appConfig).pipe(
            tap(cfg => this.setLocalConfig(cfg.identifier, cfg)),
            this.mergeAndSave.bind(this)
        ).subscribe();
    }

    config$ = this.appConfigSubject.asObservable();

    /**
     * Loads application configuration defaults and overriding them from `localStorage` or remote server.
     */
    load(identifier?: ConfigKey): Observable<AppConfig> {
        const remoteConfig = identifier !== undefined ? this.remoteConfigByIdentifier(identifier) :
            this.remoteConfigByHostname(this.hostname);

        const key = !!identifier ? identifier : this.hostname;
        const localConfig = this.localConfig(key);
        const configStoredAt = new Date(localConfig[key].stored_at).getTime();
        const offsetMillis = (new Date().getTime()) - configStoredAt;

        return of(offsetMillis > this.cacheTimeoutMinutes * 60 * 1000).pipe(
            switchMap(shouldRefresh => shouldRefresh ?
                remoteConfig.pipe(tap(config => this.setLocalConfig(key, config))) :
                of(localConfig[key].config)),
            this.mergeAndSave.bind(this)
        );
    }

    private mergeAndSave(source: Observable<AppConfig>) {
        return source.pipe(
            map(configRes => ({
                ...configRes,
                config: _merge(AppConfigService.defaultConfig.config, configRes.config)
            } as AppConfig)),
            tap(config => {
                this.appConfig = config;
                this.appConfigSubject.next(config);
            }),
        );
    }

    private remoteConfigByHostname(hostname: string) {
        return this.http.get<AppConfig>(`/api/user/public/app/config/hostname/${hostname}`).pipe(
            catchError(() => of(<AppConfig>{
                config: null
            }))
        );
    }

    private remoteConfigByIdentifier(identifier: string): Observable<AppConfig> {
        return this.http.get<AppConfig>(`/api/user/public/app/config/identifier/${identifier}`).pipe(
            catchError(() => of(<AppConfig>{
                config: null
            }))
        );
    }

    private localConfig(key: ConfigKey): AppConfigStore {
        const storageData = localStorage.getItem(this.localStorageKey) || '';

        let config: AppConfigStore;
        try {
            config = JSON.parse(storageData);
        } catch (_err) {
            config = {};
        }

        if (!!key && !config[key]) {
            config[key] = {
                stored_at: new Date(0),
                config: null
            };
        }

        return config;
    }

    private setLocalConfig(key: ConfigKey, appConfig: AppConfig) {
        if (!this.shouldSetLocalConfig(key, appConfig)) {
            return;
        }

        const configToStore = this.localConfig(key);
        configToStore[key] = {
            stored_at: new Date(),
            config: appConfig
        };

        localStorage.setItem(this.localStorageKey, JSON.stringify(configToStore));
    }

    private shouldSetLocalConfig(key: ConfigKey, appConfig: AppConfig): boolean {
        const noCoopFound = !appConfig.hostname && !appConfig.identifier;
        const keyMatch = key === appConfig.hostname || key === appConfig.identifier;

        return !!key && (noCoopFound || keyMatch);
    }

    private static get defaultConfig(): AppConfig {
        return {
            config: environment.customConfig
        };
    }
}

export type ConfigKey = string | null | undefined;

interface AppConfigStore {
    [hostnameOrIdentifier: string]: {
        stored_at: Date;
        config: AppConfig;
    };
}

export interface AppConfig {
    identifier?: string;
    name?: string;
    created_at?: Date;
    hostname?: string;
    config?: CustomConfig;
}

export interface CustomConfig {
    title?: string;
    logo_url?: string;
    icon_url?: string;
    arkane?: {
        id: string;
        env: string;
    };
    identyum?: {
        startLanguage: string;
    };
    googleClientId?: string;
    facebookAppId?: string;
    reCaptchaSiteKey?: string;
}

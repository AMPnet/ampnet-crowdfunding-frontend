import { Injectable } from '@angular/core';
import { BackendHttpClient } from './backend-http-client.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AppConfigService {
    private appConfig: AppConfig;

    private readonly hostname = window.location.hostname;
    // private readonly hostname = 'staging.ampnet.io';
    private readonly localStorageKey = 'app_config';
    private readonly cacheTimeoutMinutes = 1;

    constructor(private http: BackendHttpClient) {
    }

    /**
     * Gets application configuration.
     * This is loaded in runtime when the application starts.
     */
    get config(): AppConfig {
        return this.appConfig;
    }

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
            map(configRes => ({
                ...AppConfigService.defaultConfig,
                ...configRes,
            } as AppConfig)),
            tap(config => this.appConfig = config),
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
        if (!this.shouldSetLocalConfig(key, appConfig)) { return; }

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
            customConfig: environment.customConfig
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
    customConfig?: CustomConfig;
}

export interface CustomConfig {
    title: string;
    logo_url: string;
    icon_url: string;
    arkane: {
        id: string;
        env: string;
    };
    identyum: {
        startLanguage: string;
    };
    googleClientId: string;
    facebookAppId: string;
}

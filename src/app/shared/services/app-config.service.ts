import { Injectable } from '@angular/core';
import { BackendHttpClient } from './backend-http-client.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AppConfigService {
    private appConfig: AppConfig;

    private readonly hostname = window.location.hostname;
    private readonly localStorageKey = 'app_config';
    private readonly cacheTimeoutMinutes = 10;

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
     * This method is only meant to be used in a provider when the application starts.
     */
    load(): Promise<AppConfig> {
        const localConfig = this.localConfig(this.hostname);
        const configStoredAt = new Date(localConfig[this.hostname].stored_at).getTime();
        const offsetMillis = (new Date().getTime()) - configStoredAt;

        return of(offsetMillis > this.cacheTimeoutMinutes * 60 * 1000).pipe(
            switchMap(shouldRefresh => shouldRefresh ?
                this.remoteConfig.pipe(tap(config => this.setLocalConfig(config))) :
                of(localConfig.config)),
            map(config => ({
                ...AppConfigService.defaultConfig,
                ...config
            } as AppConfig)),
            tap(config => this.appConfig = config)
        ).toPromise();
    }

    private get remoteConfig(): Observable<AppConfig> {
        return this.http.get<AppConfigRes>(`/api/user/public/app/config/${this.hostname}`).pipe(
            map(res => res.config),
            catchError(() => of(null))
        );
    }

    private localConfig(hostname: string): AppConfigStore {
        const storageData = localStorage.getItem(this.localStorageKey) || '';

        let config: AppConfigStore;
        try {
            config = JSON.parse(storageData);
        } catch (_err) {
            config = {};
        }

        if (!config[hostname]) {
            config[hostname] = {
                stored_at: new Date(0),
                config: null
            };
        }

        return config;
    }

    private setLocalConfig(config: AppConfig) {
        const configToStore = this.localConfig(this.hostname);
        configToStore[this.hostname] = {
            stored_at: new Date(),
            config: config
        };

        localStorage.setItem(this.localStorageKey, JSON.stringify(configToStore));
    }

    private static get defaultConfig(): AppConfig {
        return environment.appConfig;
    }
}

interface AppConfigStore {
    [hostname: string]: {
        stored_at: Date;
        config: AppConfig;
    };
}

interface AppConfigRes {
    config: AppConfig;
}

export interface AppConfig {
    title: string;
    logo_url: string;
    arkane: {
        id: string;
        env: string;
    };
    googleClientId: string;
    facebookAppId: string;
}

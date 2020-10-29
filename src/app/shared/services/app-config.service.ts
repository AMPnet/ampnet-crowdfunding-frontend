import { Injectable } from '@angular/core';
import { BackendHttpClient } from './backend-http-client.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AppConfigService {
    private appConfig: AppConfig;

    private readonly hostname = window.location.hostname;
    private readonly localStorageKey = 'app_config';
    private readonly cacheTimeoutMinutes = 10;

    constructor(private http: BackendHttpClient) {
    }

    load(): Promise<AppConfig> {
        const localConfig = this.localConfig;
        const offsetMillis = (new Date().getTime()) - (new Date(localConfig.stored_at).getTime());

        return of(offsetMillis > this.cacheTimeoutMinutes * 60 * 1000).pipe(
            switchMap(shouldRefresh => shouldRefresh ?
                this.remoteConfig.pipe(tap(config => config ? this.setLocalConfig(config) : EMPTY)) :
                of(localConfig.config)),
            map(config => ({
                ...AppConfigService.defaultConfig,
                ...config
            } as AppConfig)),
            tap(config => this.appConfig = config)
        ).toPromise();
    }

    get config(): AppConfig {
        return this.appConfig;
    }

    private get remoteConfig(): Observable<AppConfig> {
        return this.http.get<AppConfigRes>(`/api/user/public/app/config/${this.hostname}`).pipe(
            map(res => res.config),
            catchError(() => of(null))
        );
    }

    private get localConfig(): AppConfigStore {
        const storageData = localStorage.getItem(this.localStorageKey) || '';

        let config: AppConfigStore;
        try {
            config = JSON.parse(storageData);
        } catch (_err) {
            config = {
                stored_at: new Date(0),
                config: null
            };
        }

        return config;
    }

    private setLocalConfig(config: AppConfig) {
        const configToStore: AppConfigStore = {
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
    stored_at: Date;
    config: AppConfig;
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

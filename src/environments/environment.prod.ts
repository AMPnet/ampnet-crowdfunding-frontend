import { CustomConfig } from '../app/shared/services/app-config.service';
import { Window } from '../../typings';

export const environment = {
    production: true,
    baseHref: '/',
    commitHash: process.env.COMMIT_HASH || '',
    sentry: {
        dsn: (window as unknown as Window)?.env?.sentryDSN || '',
        env: (window as unknown as Window)?.env?.sentryEnv || 'prod',
    },
    customConfig: { // NOTICE: when adding a new config property, add it to AppConfig interface first.
        title: 'AMPnet',
        icon_url: '/assets/favicon.ico',
        languages: {
            config: 'es:"Español" el:"Ελληνικά" hr:"Hrvatski"',
            fallback: true,
        },
        arkane: {
            id: (window as unknown as Window)?.env?.arkaneID || 'AMPnet',
            env: (window as unknown as Window)?.env?.arkaneEnv || 'prod',
        },
        identyum: {
            startLanguage: 'en'
        },
        googleClientId: '507079277405-o3834fb5jojeq3u9tmm14aobeukg3jmo.apps.googleusercontent.com',
        facebookAppId: '611379136173563',
        reCaptchaSiteKey: '6LdbkeMZAAAAAJonuNJqiS1RfMyQkv1qNHcfZ5VE'
    } as CustomConfig
};

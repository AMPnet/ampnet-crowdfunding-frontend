import { CustomConfig } from '../app/shared/services/app-config.service';

export const environment = {
    production: false,
    baseHref: '/',
    sentry: {
        dsn: '', // keep empty for local development
        env: 'dev'
    },
    customConfig: { // NOTICE: when adding a new config property, add it to AppConfig interface first.
        title: 'AMPnet',
        icon_url: '/assets/favicon.ico',
        languages: {
            config: '',
            fallback: true,
        },
        arkane: {
            id: 'AMPnet',
            env: 'staging',
        },
        googleClientId: '507079277405-o3834fb5jojeq3u9tmm14aobeukg3jmo.apps.googleusercontent.com',
        facebookAppId: '611379136173563',
        reCaptchaSiteKey: '6LdbkeMZAAAAAJonuNJqiS1RfMyQkv1qNHcfZ5VE'
    } as CustomConfig
};

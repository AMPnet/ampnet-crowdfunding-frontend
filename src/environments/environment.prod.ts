import { CustomConfig } from '../app/shared/services/app-config.service';

export const environment = {
    production: true,
    baseHref: '/',
    sentry: {
        dsn: 'https://877dd92a057e4517b8edc97c1e48f510@o471123.ingest.sentry.io/5504571',
        env: 'prod'
    },
    customConfig: { // NOTICE: when adding a new config property, add it to AppConfig interface first.
        title: 'AMPnet',
        icon_url: '/assets/favicon.ico',
        arkane: {
            id: 'AMPnet',
            env: 'staging',
        },
        googleClientId: '507079277405-o3834fb5jojeq3u9tmm14aobeukg3jmo.apps.googleusercontent.com',
        facebookAppId: '611379136173563',
        reCaptchaSiteKey: '6LdbkeMZAAAAAJonuNJqiS1RfMyQkv1qNHcfZ5VE'
    } as CustomConfig
};

import { CustomConfig } from '../app/shared/services/app-config.service';

export const environment = {
    production: false,
    baseHref: '/',
    customConfig: { // NOTICE: when adding a new config property, add it to AppConfig interface first.
        title: 'AMPnet',
        logo_url: '/assets/logo-amp.png',
        icon_url: '/assets/favicon.ico',
        arkane: {
            id: 'AMPnet',
            env: 'staging',
        },
        identyum: {
            startLanguage: 'en'
        },
        googleClientId: '507079277405-o3834fb5jojeq3u9tmm14aobeukg3jmo.apps.googleusercontent.com',
        facebookAppId: '611379136173563',
        reCaptchaSiteKey: '6LdbkeMZAAAAAJonuNJqiS1RfMyQkv1qNHcfZ5VE'
    } as CustomConfig
};

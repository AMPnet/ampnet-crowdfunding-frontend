import { AppConfig } from '../app/shared/services/app-config.service';

export const environment = {
    production: false,
    appConfig: { // NOTICE: when adding a new config property, add it to AppConfig interface first.
        title: 'AMPnet',
        logo_url: 'https://ampnet.io/assets/images/logo-amp.png',
        arkane: {
            id: 'AMPnet',
            env: 'staging',
        },
        googleClientId: '507079277405-o3834fb5jojeq3u9tmm14aobeukg3jmo.apps.googleusercontent.com',
        facebookAppId: '611379136173563',
    } as AppConfig
};

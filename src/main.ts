import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from '@sentry/angular';

Sentry.init({
    dsn: environment.sentry.dsn,
    environment: environment.sentry.env,
    tracesSampleRate: 1.0,
    ignoreErrors: [
        'Non-Error exception captured'
    ]
});

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));


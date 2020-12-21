import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from '@sentry/angular';

Sentry.init({
    // Override dns with SENTRY_DSN environment variable
    dsn: 'https://877dd92a057e4517b8edc97c1e48f510@o471123.ingest.sentry.io/5504571',
    // environment: 'dev', // Override environment with SENTRY_ENVIRONMENT environment variable
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


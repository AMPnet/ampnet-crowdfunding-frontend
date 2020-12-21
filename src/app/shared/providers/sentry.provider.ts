import { ErrorHandler, Provider } from '@angular/core';
import * as Sentry from '@sentry/angular';

export const SentryProvider: Provider = {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
        showDialog: false,
    }),
};



(function (window) {
    window.env = window.env || {};

    // startup-time environment variables
    window.env.arkaneID = '${ARKANE_ID}';
    window.env.arkaneEnv = '${ARKANE_ENV}';
    window.env.sentryDSN = '${SENTRY_DSN}';
    window.env.sentryEnv = '${SENTRY_ENV}';


})(this);

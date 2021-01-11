declare var process: Process;

interface Process {
    env: Env;
}

interface Env {
    COMMIT_HASH: string;
}

export interface Window {
    env: StartupEnv;
}

interface StartupEnv {
    arkaneID: string;
    arkaneEnv: string;
    sentryDSN: string;
    sentryEnv: string;
}

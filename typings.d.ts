declare var process: Process;

interface Process {
    env: Env;
}

interface Env {
    COMMIT_HASH: string;
}

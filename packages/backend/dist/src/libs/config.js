/* eslint-disable node/no-process-env */
export function setDefaultEnv() {
    if (!process.env.NODE_ENV) {
        // Use console.log here to avoid circular dependency with logger
        // eslint-disable-next-line no-console
        console.log("NODE_ENV is not set, setting to development");
        process.env.NODE_ENV = "development";
    }
}
export function getNodeEnv() {
    return process.env.NODE_ENV ?? "";
}

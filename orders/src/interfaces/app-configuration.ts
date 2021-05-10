
export enum AppEnv {
    development,
    test,
    production
}

export interface AppConfiguration {
    env: AppEnv
    jwtKey: string,
    mongoURI: string
}
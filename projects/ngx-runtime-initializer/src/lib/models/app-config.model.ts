export interface CoreConfig {
  apiURL: string;
  debug: boolean;
  requestTimeout: number;
}

export interface RuntimeConfig {
  coreConfig: CoreConfig;
  [key: string]: any;
}

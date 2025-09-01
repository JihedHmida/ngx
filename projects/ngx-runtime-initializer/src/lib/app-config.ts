import { RuntimeConfig } from './models/app-config.model';

/**
 * Implementation of the runtime application configuration.
 *
 * Holds core configuration values (API URL, debug mode, request timeout)
 * and the current status of the application.
 *
 * Can be initialized partially using a `Partial<RuntimeConfig>` object,
 * with optional override for the `status` flag.
 *
 * @example
 * // Default initialization
 * const config = new AppConfig();
 *
 * // Initialize with custom API URL and enable debug
 * const config = new AppConfig({
 *   coreConfig: { apiURL: 'https://api.example.com', debug: true, requestTimeout: 20000 }
 * }, true);
 */
export class AppConfig implements RuntimeConfig {
  /**
   * Core configuration object containing API URL, debug flag, and request timeout.
   */
  coreConfig = {
    apiURL: '__BACKEND__',
    debug: false,
    requestTimeout: 30000,
  };

  /**
   * Status of the application (true = up/active, false = down/maintenance).
   */
  status = false;

  /**
   * Creates a new AppConfig instance.
   *
   * @param init - Partial configuration to override default values.
   * @param status - Optional status override (default is `false`).
   */
  constructor(init?: Partial<RuntimeConfig>, status: boolean = false) {
    Object.assign(this, init);
    this.status = status;
  }
}

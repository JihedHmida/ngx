import { Injectable, signal, WritableSignal } from '@angular/core';
import { AppConfig } from './app-config';

/**
 * Service for managing the application's runtime configuration.
 *
 * Provides reactive access to the configuration using Angular signals,
 * allows updating configuration at runtime, and exposes convenience
 * methods to retrieve configuration values or application status.
 *
 * Additionally, it sets global variables `$CORE_API` and `$DEBUG`
 * when the configuration is updated.
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  /**
   * Internal writable signal holding the current application configuration.
   */
  private readonly config: WritableSignal<AppConfig> = signal<AppConfig>(new AppConfig());

  /**
   * Updates the application configuration.
   *
   * This will also update the global variables:
   * - `$CORE_API` with `config.coreConfig.apiURL`
   * - `$DEBUG` with `config.coreConfig.debug`
   *
   * @param config - The new configuration to set.
   */
  setConfig(config: AppConfig) {
    (globalThis as any).$CORE_API = config.coreConfig.apiURL;
    (globalThis as any).$DEBUG = config.coreConfig.debug;
    this.config.set(config);
  }

  /**
   * Returns the current status of the application.
   *
   * @returns `true` if the app is up/active, `false` if it is down/maintenance.
   */
  getStatus(): boolean {
    return this.config().status;
  }

  /**
   * Returns the reactive `WritableSignal` holding the configuration.
   *
   * Consumers can subscribe to this signal for reactive updates.
   *
   * @returns The `WritableSignal<AppConfig>` instance.
   */
  getConfigSignal(): WritableSignal<AppConfig> {
    return this.config;
  }

  /**
   * Returns the current configuration snapshot.
   *
   * @returns The current `AppConfig` object.
   */
  getConfig(): AppConfig {
    return this.config();
  }

  /**
   * Retrieves a specific property from the current configuration.
   *
   * @typeParam T - Expected type of the property.
   * @param key - The key of the property in `AppConfig`.
   * @returns The value of the property if it exists, otherwise `undefined`.
   *
   * @example
   * const apiUrl = service.getConfigProperty<string>('coreConfig').apiURL;
   */
  getConfigProperty<T>(key: keyof AppConfig): T | undefined {
    return this.config()[key] as T;
  }
}

import { Type } from '@angular/core';
import { AppConfig } from '../app-config';

/**
 * Options for configuring the runtime initializer.
 */
export class RuntimeInitializerOptions {
  /** URL of the runtime configuration JSON */
  configUrl: string = 'config.json';

  /** Array of Angular service classes to inject and pass to callbacks */
  servicesToInject: Type<any>[] = [];

  /**
   * Optional async callback executed after successful configuration load.
   * Receives the loaded `AppConfig` and an object mapping injected services by class name.
   */
  postInit: (config: AppConfig, services: Record<string, any>) => Promise<void> = async () => {};

  /**
   * Optional callback executed if initialization fails.
   * Receives the error and injected services object.
   */
  handleInitializationFailure: (error: any, services: Record<string, any>) => void = () => {};

  /**
   * Constructor for fast initialization or custom values.
   * @param configUrl - URL of the config JSON
   * @param servicesToInject - Array of Angular services to inject
   * @param postInit - Callback after successful initialization
   * @param handleInitializationFailure - Callback on initialization failure
   */
  constructor(
    configUrl?: string,
    servicesToInject?: Type<any>[],
    postInit?: (config: AppConfig, services: Record<string, any>) => Promise<void>,
    handleInitializationFailure?: (error: any, services: Record<string, any>) => void
  ) {
    if (configUrl) this.configUrl = configUrl;
    if (servicesToInject) this.servicesToInject = servicesToInject;
    if (postInit) this.postInit = postInit;
    if (handleInitializationFailure) this.handleInitializationFailure = handleInitializationFailure;
  }
}

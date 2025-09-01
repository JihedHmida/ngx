import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, provideAppInitializer } from '@angular/core';
import { catchError, firstValueFrom, of, throwError, timeout } from 'rxjs';
import { AppConfigService, RuntimeInitializerOptions } from '../public-api';
import { AppConfig } from './app-config';

/**
 * Provides an Angular application initializer that loads runtime configuration from a JSON file
 * and optionally injects additional services.
 *
 * @param options - Configuration options for the runtime initializer.
 *
 * @returns A provider for Angular's `APP_INITIALIZER`.
 *
 * @example
 * // Basic usage: load config from default 'config.json'
 * provideRuntimeInitializer({});
 *
 * @example
 * // With custom services and post-init callback
 * provideRuntimeInitializer({
 *   configUrl: '/assets/runtime-config.json',
 *   servicesToInject: [MyService1, MyService2],
 *   postInit: async (config, services) => {
 *     console.log('Config loaded:', config);
 *     services.MyService1?.initialize();
 *   },
 *   handleInitializationFailure: (error, services) => {
 *     console.warn('Failed to initialize runtime config:', error);
 *   }
 * });
 */
export function provideRuntimeInitializer({
  configUrl = 'config.json',
  servicesToInject = [],
  postInit = async () => {},
  handleInitializationFailure = () => {},
}: RuntimeInitializerOptions) {
  return provideAppInitializer(async () => {
    const http = inject(HttpClient);
    const appService = inject(AppConfigService);
    const injectedServices: Record<string, any> = {};

    servicesToInject.forEach((cls) => {
      try {
        injectedServices[cls.name.replace('_', '')] = inject(cls, { optional: true });
      } catch {
        injectedServices[cls.name.replace('_', '')] = undefined;
      }
    });

    try {
      const runtimeConfig = await firstValueFrom(
        http.get<AppConfig>(configUrl).pipe(
          timeout(3000),
          catchError((err) => {
            if (err.name === 'TimeoutError') {
              return throwError(() => new Error(`[RuntimeInitializer] Timeout: Could not load config from ${configUrl}`));
            }
            if (err instanceof HttpErrorResponse) {
              return throwError(
                () => new Error(`[RuntimeInitializer] Failed to load config from ${configUrl}: ${err.status} ${err.statusText}`)
              );
            }
            return throwError(() => err);
          })
        )
      );

      if (runtimeConfig.coreConfig.debug) {
        console.log(runtimeConfig);
      }

      if (!runtimeConfig?.coreConfig) {
        throw new Error('[RuntimeInitializer] Missing coreConfig in config.json');
      }
      if (!runtimeConfig.coreConfig.apiURL) {
        throw new Error('[RuntimeInitializer] coreConfig.apiURL is required');
      }
      if (typeof runtimeConfig.coreConfig.debug !== 'boolean') {
        throw new Error('[RuntimeInitializer] coreConfig.debug must be boolean');
      }
      if (typeof runtimeConfig.coreConfig.requestTimeout !== 'number') {
        throw new Error('[RuntimeInitializer] coreConfig.requestTimeout must be a number');
      }

      appService.setConfig(new AppConfig(runtimeConfig, true));

      if (postInit) {
        await postInit(appService.getConfig(), injectedServices);
      }
      return of(runtimeConfig);
    } catch (error) {
      console.error('Failed to load runtime config', error);
      const fallbackConfig = new AppConfig();

      appService.setConfig(fallbackConfig);
      if (handleInitializationFailure) {
        handleInitializationFailure(error, injectedServices);
      }
      return of(fallbackConfig);
    }
  });
}

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { SeoDefaultContent } from '../../projects/ngx-seo-utils/src/public-api';
import { routes } from './app.routes';

const defaultSeoContent = new SeoDefaultContent(
  'Home',
  'Testing ',
  'Title',
  'http://localhost',
  'https://ogp.me/logo.png'
);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(
      withHttpTransferCacheOptions({ includePostRequests: true }),
      withEventReplay(),
      withIncrementalHydration()
    ),
    provideHttpClient(withFetch()),
  ],
};

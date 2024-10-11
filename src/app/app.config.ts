import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { SeoDefaultContent, SeoUtilsModule } from '../../projects/ngx-seo-utils/src/public-api';
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
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withHttpTransferCacheOptions({ includePostRequests: true }), withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(SeoUtilsModule.forRoot(defaultSeoContent)),
    // importProvidersFrom(StorageUtilsModule.forRoot({ encryptionKey: 'ABC' })),
  ],
};

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
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
    provideRouter(routes),
    provideClientHydration(withHttpTransferCacheOptions({ includePostRequests: true })),
    provideHttpClient(withFetch()),
    importProvidersFrom(SeoUtilsModule.forRoot(defaultSeoContent)),
  ],
};

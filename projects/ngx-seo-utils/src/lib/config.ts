import { InjectionToken } from '@angular/core';
import { SeoDefaultContent } from './seo-content';

export const SeoUtilsConfig = new InjectionToken<SeoDefaultContent>('NGX_SEO_UTILS_CONFIG');

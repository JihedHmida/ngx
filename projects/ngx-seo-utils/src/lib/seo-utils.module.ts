import { ModuleWithProviders, NgModule } from '@angular/core';
import { SeoUtilsConfig } from './config';
import { SeoDefaultContent } from './seo-content';
import { SeoUtilsService } from './seo-utils.service';

@NgModule({
  imports: [],
  exports: [],
  providers: [],
})
export class SeoUtilsModule {
  static forRoot(seoDefaultContent: SeoDefaultContent): ModuleWithProviders<SeoUtilsModule> {
    return {
      ngModule: SeoUtilsModule,
      providers: [SeoUtilsService, { provide: SeoUtilsConfig, useValue: seoDefaultContent }],
    };
  }
}

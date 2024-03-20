import { ModuleWithProviders, NgModule } from '@angular/core';
import { StorageUtilsConfig } from './config/config';
import { CookiesService } from './cookies.service';
import { StorageDefaultConfig } from './model/storage-config';
import { StorageService } from './storage.service';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [],
})
export class StorageUtilsModule {
  static forRoot(storageDefaultConfig: StorageDefaultConfig): ModuleWithProviders<StorageUtilsModule> {
    return {
      ngModule: StorageUtilsModule,
      providers: [StorageService, CookiesService, { provide: StorageUtilsConfig, useValue: storageDefaultConfig }],
    };
  }
}

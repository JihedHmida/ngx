import { InjectionToken } from '@angular/core';
import { StorageDefaultConfig } from '../model/storage-config';

export const StorageUtilsConfig = new InjectionToken<StorageDefaultConfig>('NGX_STORAGE_UTILS_CONFIG');

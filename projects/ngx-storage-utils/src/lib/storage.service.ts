import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { StorageUtilsConfig } from './config/config';
import { StorageDefaultConfig } from './model/storage-config';
import { StorageObject, StorageSetOptions } from './model/storageObject';
import { CryptoUtils } from './utils/crypto.utils';
const DEFAULT_CONFIG = new StorageDefaultConfig();

@Injectable({
  providedIn: 'root',
})
export class StorageService implements Storage {
  private readonly isBrowser: boolean;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _ = inject(StorageUtilsConfig, { optional: true }) ?? DEFAULT_CONFIG;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get length(): number {
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Returning default value.');
      return 0;
    }

    return localStorage.length;
  }

  clear(): void {
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Data cannot be cleared.');
    } else {
      localStorage.clear();
    }
  }

  getTypedItem<T = unknown>(key: string, encryptionKey: string = '', validate: boolean = true): T | null {
    encryptionKey = encryptionKey || this._.encryptionKey;
    const data = this.getItem(key, encryptionKey, validate);
    if (data) {
      try {
        return JSON.parse(data) as T;
      } catch (error) {
        console.error(`Error parsing or validating storage item: ${key}`, error);
        return null;
      }
    }
    return null;
  }

  getStorageItem(key: string, encryptionKey: string = '', validate: boolean = true): StorageObject | null {
    encryptionKey = encryptionKey || this._.encryptionKey;
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Returning default value.');
      return null;
    }

    const storageItemString = localStorage.getItem(key);
    if (!storageItemString) return null;

    try {
      const storageItem: StorageObject = JSON.parse(storageItemString);

      if (validate) {
        if (storageItem.isExpirable && storageItem.expires) {
          const expirationDate = new Date(storageItem.expires);
          if (expirationDate <= new Date()) {
            this.removeItem(key);
            console.info(`Expired item removed: ${key}`);
            return null;
          }
        }
      }

      if (encryptionKey !== '') {
        if (storageItem.isEncrypted) {
          storageItem.value = CryptoUtils.decrypt(storageItem.value, encryptionKey);
        } else {
          console.warn(`Storage item : ${key} is not encrypted.`);
        }
      }
      return storageItem;
    } catch (error) {
      console.error(`Error parsing or validating storage item: ${key}`, error);
      return null;
    }
  }

  getItem(key: string, encryptionKey: string = '', validate: boolean = true): string | null {
    encryptionKey = encryptionKey || this._.encryptionKey;
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Returning default value.');
      return null;
    }

    const storageItemString = localStorage.getItem(key);
    if (!storageItemString) return null;

    try {
      const storageItem: StorageObject = JSON.parse(storageItemString);

      if (validate) {
        if (storageItem.isExpirable && storageItem.expires) {
          const expirationDate = new Date(storageItem.expires);
          if (expirationDate <= new Date()) {
            console.warn(`Expired item : ${key}`);
            return null;
          }
        }
      }
      if (encryptionKey !== '') {
        if (storageItem.isEncrypted) {
          return CryptoUtils.decrypt(storageItem.value, encryptionKey);
        }
        console.warn(`Storage item : ${key} is not encrypted.`);
      }
      return storageItem.value;
    } catch {
      return null;
    }
  }

  key(index: number): string | null {
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Returning default value.');
      return null;
    } else {
      return localStorage.key(index);
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Data cannot be removed.');
    } else {
      localStorage.removeItem(key);
    }
  }

  setItem(key: string, value: string, options?: StorageSetOptions): void {
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Data will not be stored.');
      return;
    }

    const storageObject: StorageObject = {
      value: value,
    };

    if (options) {
      if (options.encryptionKey || this._.encryptionKey) {
        const encryptionKey = options.encryptionKey ?? this._.encryptionKey;
        storageObject.value = CryptoUtils.encrypt(value, encryptionKey);
        storageObject.isEncrypted = true;
      }

      if (options.maxAge) {
        storageObject.expires = new Date(Date.now() + options.maxAge * 86400000);
        storageObject.isExpirable = true;
      }

      if (options.expires) {
        storageObject.expires = options.expires;
        storageObject.isExpirable = true;
      }
    } else if (this._.encryptionKey) {
      storageObject.value = CryptoUtils.encrypt(value, this._.encryptionKey);
      storageObject.isEncrypted = true;
    }

    localStorage.setItem(key, JSON.stringify(storageObject));
  }

  validate(): void {
    if (!this.isBrowser) {
      console.warn('Storage is not available on the server side. Data will not be validated.');
      return;
    }

    for (let index = 0; index < this.length; index++) {
      const key = this.key(index);
      if (!key) continue;
      const storageItemString = localStorage.getItem(key);
      if (!storageItemString) continue;

      try {
        const storageItem: StorageObject = JSON.parse(storageItemString);
        if (storageItem.isExpirable && storageItem.expires) {
          const expirationDate = new Date(storageItem.expires);
          if (expirationDate <= new Date()) {
            this.removeItem(key);
            console.info(`Expired item removed: ${key}`);
          }
        }
      } catch (error) {
        console.error(`Storage item: ${key} is not of StorageObject type`, error);
      }
    }
  }
}

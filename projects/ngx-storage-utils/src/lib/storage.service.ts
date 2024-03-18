import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AES } from 'crypto-es/lib/aes';
import { Utf8 } from 'crypto-es/lib/core';
import { StorageObject, StorageSetOptions } from './storageObject';

@Injectable({
  providedIn: 'root',
})
export class StorageService implements Storage {
  private readonly isBrowser: boolean;
  private readonly platformId = inject(PLATFORM_ID);

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
          storageItem.value = StorageService.decrypt(storageItem.value, encryptionKey);
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
          return StorageService.decrypt(storageItem.value, encryptionKey);
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

    if (!options) {
      localStorage.setItem(key, JSON.stringify(storageObject));
      return;
    }

    if (options.encryptionKey && options.encryptionKey !== '') {
      storageObject.value = StorageService.encrypt(value, options.encryptionKey);
      storageObject.isEncrypted = true;
    }

    if (options.maxAge) {
      storageObject.expires = new Date(new Date().getTime() + options.maxAge * 86_400_000);
      storageObject.isExpirable = true;
    }

    if (options.expires) {
      storageObject.expires = options.expires;
      storageObject.isExpirable = true;
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

  private static encrypt(data: string, encryptionKey: string): string {
    return AES.encrypt(data, encryptionKey).toString();
  }

  private static decrypt(encryptedData: string, encryptionKey: string): string {
    return AES.decrypt(encryptedData, encryptionKey).toString(Utf8);
  }
}

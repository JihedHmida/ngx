# Ngx Storage Utils

[![npm version](https://badge.fury.io/js/ngx-storage-utils.svg)](https://badge.fury.io/js/ngx-storage-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**NgxStorageUtils** is an npm package designed to simplify cookie and storage management in Angular applications, especially in Server-Side Rendering (SSR) environments.

## Features

- Manage cookies and storage in Angular SSR applications effortlessly.
- Compatible with Angular Universal for SSR setups.
- Provides a simple API for setting, getting, and removing cookies and storage items.
- Supports both client-side and server-side execution.
- Encrypts data stored in local storage for enhanced security.

## Installation

Install the package via npm:

```bash
npm install ngx-storage-utils
```
## Usage

### Usage in Components or Services

Inject and use `CookiesService` or `StorageService` in your Angular components or services:

```typescript
import { Component } from '@angular/core';
import { CookiesService, StorageService } from 'ngx-storage-utils';

@Component({
  selector: 'app-root',
  template: `<h1>ngx-storage-utils</h1>`,
})
export class AppComponent {
  cookiesService = inject(CookiesService);
  storageService = inject(StorageService);
}
```

## API

## StorageService API

- `clear(): void`: Clears all items from local storage.
 
- `getTypedItem<T = unknown>(key: string, encryptionKey: string = '', validate: boolean = true): T | null`: Retrieves and parses an item by key.
 
- `getStorageItem(key: string, validate: boolean): StorageObject | null`: Retrieves the storage item as `StorageObject` associated with the key.
 
- `getItem(key: string, validate: boolean = true): string | null`: Retrieves the string value associated with the key.
 
- `key(index: number): string | null`: Retrieves the key of the storage item at the specified index.
 
- `removeItem(key: string): void`: Removes the storage item associated with the key.
 
- `setItem(key: string, value: string, options?: StorageSetOptions): void`: Sets the value of the storage item associated with the key.
 
- `validate(): void`: Validates and removes expired storage items.

### StorageObject Interface

Represents an object stored in local storage.

### Properties

- `value: string`: The value stored in the local storage.

- `isEncrypted?: boolean`: (Optional) Indicates whether the stored item is encrypted.

- `isExpirable?: boolean`: (Optional) Indicates whether the stored item is expirable.

- `expires?: Date`: (Optional) The expiration date of the stored item.

---
## CookiesService API


### Methods

- `check(name: string): boolean`: Check if a cookie exists.
- `get(name: string): string`: Get the value of a cookie.
- `getAll(): { [key: string]: string }`: Get all cookies.
- `set(name: string, value: string, options?: CookieOptions): void`: Set a cookie.
- `delete(name: string, path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'Strict' | 'None' = 'Lax'): void`: Delete a cookie.
- `deleteAll(path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'): void`: Delete all cookies.


### CookieOptions

- `expires?: number | Date`: Expiration date of the cookie. If not set, the cookie is a session cookie.
- `path?: string`: Path for which the cookie is valid.
- `domain?: string`: Domain for which the cookie is valid.
- `secure?: boolean`: If true, the cookie will only be sent over HTTPS.
- `sameSite?: 'Lax' | 'Strict' | 'None'`: SameSite attribute of the cookie.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
<!-- ## Contributions -->

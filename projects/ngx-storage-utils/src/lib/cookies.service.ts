import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, Optional, PLATFORM_ID, REQUEST, DOCUMENT } from '@angular/core';
import { StorageUtilsConfig } from './config/config';
import { CookieObject, CookieOptions } from './model/cookieOptions';
import { StorageDefaultConfig } from './model/storage-config';
import { CryptoUtils } from './utils/crypto.utils';
const DEFAULT_CONFIG = new StorageDefaultConfig();

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  private readonly isBrowser: boolean;
  private readonly platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private readonly _ = inject(StorageUtilsConfig, { optional: true }) ?? DEFAULT_CONFIG;

  constructor(@Optional() @Inject(REQUEST) private request: Request) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private get cookies(): string {
    return this.isBrowser ? this.document.cookie ?? '' : this.request?.headers.get('cookie') ?? '';
  }

  check(name: string): boolean {
    const title = encodeURIComponent(name);
    const regExp: RegExp = getCookieRegExp(title);
    const cookies = this.cookies;
    return regExp.test(cookies);
  }

  get(name: string, encryptionKey: string = ''): string {
    encryptionKey = encryptionKey || this._.encryptionKey;
    if (this.check(name)) {
      name = encodeURIComponent(name);
      const regExp: RegExp = getCookieRegExp(name);
      const cookies = this.cookies;
      const result: RegExpExecArray | null = regExp.exec(cookies);
      const cookieValueString = result && result[1] ? CookiesService.safeDecodeURIComponent(result[1]) : '';

      try {
        const cookieObject: CookieObject = JSON.parse(cookieValueString);
        if (encryptionKey !== '') {
          if (cookieObject.isEncrypted) {
            return CryptoUtils.decrypt(cookieObject.value, encryptionKey);
          }
          if (this._.verbose) console.warn(`Cookie item : ${name} is not encrypted.`);
        }
        return cookieObject.value;
      } catch {
        return '';
      }
    } else {
      if (this._.verbose) console.warn(`Cookie item : ${name} does not exist.`);
      return '';
    }
  }

  getAll(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookieString = this.cookies;

    if (cookieString !== '') {
      cookieString.split(';').forEach((currentCookie) => {
        const [cookieName, cookieValue] = currentCookie.split('=');
        cookies[CookiesService.safeDecodeURIComponent(cookieName.replace(/^ /, ''))] = JSON.parse(
          CookiesService.safeDecodeURIComponent(cookieValue)
        );
      });
    }

    return cookies;
  }

  set(name: string, value: string, options?: CookieOptions): void {
    if (!this.isBrowser) {
      if (this._.verbose) console.warn('Setting cookies is not available on the server side.');
      return;
    }

    const cookieObject: CookieObject = {
      value: encodeURIComponent(value),
    };

    let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(JSON.stringify(cookieObject)) + ';';

    if (options) {
      if (options.encryptionKey || this._.encryptionKey) {
        const encryptionKey = options.encryptionKey ?? this._.encryptionKey;
        cookieObject.value = CryptoUtils.encrypt(value, encryptionKey);
        cookieObject.isEncrypted = true;
        cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(JSON.stringify(cookieObject)) + ';';
      }

      if (options.maxAge) {
        const expiresDate = new Date(new Date().getTime() + options.maxAge * 86_400_000);
        cookieString += 'expires=' + expiresDate.toUTCString() + ';';
      }

      cookieString += options.expires ? 'expires=' + options.expires.toUTCString() + ';' : '';
      cookieString += options.path ? 'path=' + options.path + ';' : '';
      cookieString += options.domain ? 'domain=' + options.domain + ';' : '';

      if (options.secure === false && options.sameSite === 'None') {
        options.secure = true;
        if (this._.verbose) console.warn(` Cookie ${name} was forced with secure flag because sameSite=None.`);
      }

      cookieString += options.secure ? 'secure;' : '';
      cookieString += 'sameSite=' + (options.sameSite || 'Lax') + ';';
      cookieString += options.httpOnly ? 'HttpOnly;' : '';
      cookieString += options.signed ? 'Signed;' : '';
      cookieString += options.priority ? 'Priority=' + options.priority + ';' : '';
      cookieString += options.partitioned ? 'Partitioned;' : '';
    } else if (this._.encryptionKey) {
      cookieObject.value = CryptoUtils.encrypt(value, this._.encryptionKey);
      cookieObject.isEncrypted = true;
      cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(JSON.stringify(cookieObject)) + ';';
    }

    this.document.cookie = cookieString;
  }

  delete(
    name: string,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: 'Lax' | 'Strict' | 'None' = 'Lax'
  ): void {
    if (!this.isBrowser) {
      if (this._.verbose) console.warn('Deleting cookies is not available on the server side.');
      return;
    }
    const expiresDate = new Date(0);
    this.set(name, '', {
      expires: expiresDate,
      path,
      domain,
      secure,
      sameSite,
    });
  }

  deleteAll(path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'): void {
    if (!this.isBrowser) {
      if (this._.verbose) console.warn('Deleting cookies is not available on the server side.');
      return;
    }

    const cookies = this.getAll();

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain, secure, sameSite);
      }
    }
  }

  private static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      return encodedURIComponent;
    }
  }
}

function getCookieRegExp(name: string): RegExp {
  const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');
  return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
}

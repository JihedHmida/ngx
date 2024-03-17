import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, inject } from '@angular/core';
import { Request } from 'express';
import { CookieOptions } from './cookieOptions';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  private readonly isBrowser: boolean;
  private readonly platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  constructor(@Optional() @Inject('REQUEST') private request: Request) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private get cookies(): string {
    return this.isBrowser ? this.document.cookie ?? '' : this.request?.headers.cookie ?? '';
  }

  check(name: string): boolean {
    name = encodeURIComponent(name);
    const regExp: RegExp = CookiesService.getCookieRegExp(name);
    const cookies = this.cookies;
    return regExp.test(cookies);
  }

  get(name: string): string {
    if (this.check(name)) {
      name = encodeURIComponent(name);

      const regExp: RegExp = CookiesService.getCookieRegExp(name);

      const cookies = this.cookies;

      const result: RegExpExecArray | null = regExp.exec(cookies);

      return result && result[1] ? CookiesService.safeDecodeURIComponent(result[1]) : '';
    } else {
      return '';
    }
  }

  getAll(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookieString = this.cookies;

    if (cookieString !== '') {
      cookieString.split(';').forEach((currentCookie) => {
        const [cookieName, cookieValue] = currentCookie.split('=');
        cookies[CookiesService.safeDecodeURIComponent(cookieName.replace(/^ /, ''))] =
          CookiesService.safeDecodeURIComponent(cookieValue);
      });
    }

    return cookies;
  }

  set(name: string, value: string, options?: CookieOptions): void {
    if (!this.isBrowser) {
      console.warn('Setting cookies is not available on the server side.');
      return;
    }
    let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    if (!options) {
      this.document.cookie = cookieString;
      return;
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
      console.warn(` Cookie ${name} was forced with secure flag because sameSite=None.`);
    }

    cookieString += options.secure ? 'secure;' : '';
    cookieString += 'sameSite=' + (options.sameSite || 'Lax') + ';';
    cookieString += options.httpOnly ? 'HttpOnly;' : '';
    cookieString += options.signed ? 'Signed;' : '';
    cookieString += options.priority ? 'Priority=' + options.priority + ';' : '';
    cookieString += options.partitioned ? 'Partitioned;' : '';

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
      console.warn('Deleting cookies is not available on the server side.');
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
      console.warn('Deleting cookies is not available on the server side.');
      return;
    }

    const cookies = this.getAll();

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain, secure, sameSite);
      }
    }
  }

  private static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');
    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }

  private static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      return encodedURIComponent;
    }
  }
}

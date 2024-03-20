export interface CookieOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  partitioned?: boolean;
  priority?: 'low' | 'medium' | 'high';
  encryptionKey?: string;
}

export interface CookieObject {
  value: string;
  isEncrypted?: boolean;
}

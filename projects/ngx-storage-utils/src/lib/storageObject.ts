export interface StorageObject {
  value: string;
  isExpirable?: boolean;
  isEncrypted?: boolean;
  expires?: Date;
}
export interface StorageSetOptions {
  isExpirable?: boolean;
  maxAge?: number;
  expires?: Date;
  encryptionKey?: string;
}

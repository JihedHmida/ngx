export interface StorageObject {
  value: string;
  isExpirable?: boolean;
  isEncrypted?: boolean;
  expires?: Date;
}
export interface StorageSetOptions {
  maxAge?: number;
  expires?: Date;
  encryptionKey?: string;
}

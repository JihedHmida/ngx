import { AES } from 'crypto-es/lib/aes';
import { Utf8 } from 'crypto-es/lib/core';

export class CryptoUtils {
  public static encrypt(data: string, encryptionKey: string): string {
    return AES.encrypt(data, encryptionKey).toString();
  }

  public static decrypt(encryptedData: string, encryptionKey: string): string {
    return AES.decrypt(encryptedData, encryptionKey).toString(Utf8);
  }
}

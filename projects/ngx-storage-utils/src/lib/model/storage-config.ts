export class StorageDefaultConfig {
  encryptionKey: string;
  constructor(encryptionKey?: string) {
    this.encryptionKey = encryptionKey ?? '';
  }
}

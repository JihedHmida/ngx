export class StorageDefaultConfig {
  encryptionKey: string;
  verbose: boolean;
  constructor(encryptionKey?: string, verbose?: boolean) {
    this.encryptionKey = encryptionKey ?? '';
    this.verbose = verbose ?? false;
  }
}

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class FakeDiskStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async save(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async delete(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(f => f === file);

    this.storage.splice(findIndex, 1);
  }
}

export default FakeDiskStorageProvider;

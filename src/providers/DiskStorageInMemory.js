class DiskStorageInMemory {
  constructor() {
    this.files = new Map();
  }

  async saveFile(file) {
    this.files.set(file, file);
    return file;
  }

  async deleteFile(file) {
    this.files.delete(file);
  }
}

module.exports = DiskStorageInMemory;

/* eslint-disable @typescript-eslint/no-explicit-any */
export class SecureStorage {
  private encryptionKey = 'your-encryption-key';
  //TODO: in production, use environment variable

  async set(key: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = this.encrypt(serialized);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('SecureStorage set error:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('SecureStorage get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }

  private encrypt(text: string): string {
    /**
     * NOTE: in this example, we are using
     * simple XOR encryption for demo
     * in production, use Web Crypto API or a library like crypto-js
     */
    return btoa(
      text
        .split('')
        .map((char, i) =>
          String.fromCharCode(
            char.charCodeAt(0) ^
              this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
          )
        )
        .join('')
    );
  }

  private decrypt(encrypted: string): string {
    try {
      const decoded = atob(encrypted);
      return decoded
        .split('')
        .map((char, i) =>
          String.fromCharCode(
            char.charCodeAt(0) ^
              this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
          )
        )
        .join('');
    } catch {
      throw new Error('Decryption failed');
    }
  }
}

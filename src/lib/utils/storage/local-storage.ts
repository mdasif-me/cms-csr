/* eslint-disable @typescript-eslint/no-explicit-any */
export class LocalStorage {
  private static instance: LocalStorage;
  private prefix = 'app_';

  private constructor() {}

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  set(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  }

  get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    //NOTE: only clear app-specific keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  has(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null;
  }

  keys(): string[] {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.substring(this.prefix.length));
  }

  getWithPrefix(prefix: string): Record<string, any> {
    const result: Record<string, any> = {};

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix + prefix)) {
        try {
          const value = JSON.parse(localStorage.getItem(key)!);
          result[key.substring(this.prefix.length)] = value;
        } catch {
          //HACK: skip invalid JSON
        }
      }
    });

    return result;
  }
}

export const localStorageService = LocalStorage.getInstance();

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ICacheEntry {
  data: any;
  timestamp: number;
  expires_at: number;
}

export class CacheManager {
  private cache = new Map<string, ICacheEntry>();
  private max_entries = 100;
  private cleanup_interval = 5 * 60 * 1000; //INFO: 5 minutes

  constructor() {
    //INFO: start cleanup timer
    setInterval(() => this.cleanup(), this.cleanup_interval);
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    //INFO: evict oldest entry if cache is full
    if (this.cache.size >= this.max_entries) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expires_at: Date.now() + ttl,
    });
  }

  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    //INFO: check if expired
    if (Date.now() > entry.expires_at) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clearAll(): void {
    this.cache.clear();
  }

  clearByUrl(url: string): void {
    const pattern = new RegExp(url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    for (const [key] of this.cache.entries()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clearByPattern(pattern: RegExp): void {
    for (const [key] of this.cache.entries()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  has(key: string): boolean {
    return (
      this.cache.has(key) && Date.now() <= (this.cache.get(key)?.expires_at || 0)
    );
  }

  private cleanup(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires_at) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      max_entries: this.max_entries,
      keys: Array.from(this.cache.keys()),
    };
  }
}

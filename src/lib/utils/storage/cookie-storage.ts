import Cookies from 'universal-cookie';

interface ICookieOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export class CookieStorage {
  private cookies: Cookies;

  constructor() {
    this.cookies = new Cookies();
  }

  set(key: string, value: string, options: ICookieOptions = {}): void {
    const defaultOptions: ICookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      ...(process.env.NEXT_PUBLIC_COOKIE_DOMAIN && {
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      }),
    };

    this.cookies.set(key, value, { ...defaultOptions, ...options });
  }

  get(key: string): string | undefined {
    return this.cookies.get(key);
  }

  getAll(): Record<string, string> {
    return this.cookies.getAll();
  }

  delete(key: string, options: ICookieOptions = {}): void {
    this.cookies.remove(key, {
      path: '/',
      ...options,
    });
  }

  has(key: string): boolean {
    return !!this.get(key);
  }

  clearAll(): void {
    const allCookies = this.getAll();
    Object.keys(allCookies).forEach((key) => {
      this.delete(key);
    });
  }
}

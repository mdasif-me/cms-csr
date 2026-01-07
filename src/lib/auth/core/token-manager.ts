/* eslint-disable @typescript-eslint/no-explicit-any */
import { CookieStorage } from '@/lib/utils/storage/cookie-storage';
import { SecureStorage } from '@/lib/utils/storage/secure-storage';
import { jwtDecode, type JwtPayload as IJwtPayload } from 'jwt-decode';

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface IDecodedToken extends IJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  tenantId?: string;
  sessionId?: string;
}

class TokenManager {
  private static instance: TokenManager;
  private cookieStorage = new CookieStorage();
  private secureStorage = new SecureStorage();
  private memoryCache = new Map<string, any>();

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async setTokens(tokens: IAuthTokens): Promise<void> {
    try {
      //INFO: store in cookies (cannot use httpOnly from client-side)
      // Note: httpOnly cookies must be set by the server via Set-Cookie header
      this.cookieStorage.set('access_token', tokens.accessToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: Math.floor((tokens.expiresAt - Date.now()) / 1000),
      });

      this.cookieStorage.set('refresh_token', tokens.refreshToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: Number(process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY) || 604800,
      });

      //INFO: store in secure storage for fallback
      await this.secureStorage.set('auth_tokens', JSON.stringify(tokens));

      //INFO: cache in memory for performance
      this.memoryCache.set('auth_tokens', tokens);
      const decoded = this.decodeToken(tokens.accessToken);
      if (decoded) {
        this.memoryCache.set('decoded_token', decoded);
      }
    } catch (error) {
      console.error('Token storage failed:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      //INFO: check memory cache first
      const cachedTokens = this.memoryCache.get('auth_tokens') as IAuthTokens;
      if (
        cachedTokens?.accessToken &&
        !this.isTokenExpired(cachedTokens.accessToken)
      ) {
        return cachedTokens.accessToken;
      }

      //INFO: check cookies
      const cookieToken = this.cookieStorage.get('access_token');
      if (cookieToken && !this.isTokenExpired(cookieToken)) {
        return cookieToken;
      }

      //INFO: check secure storage
      const secureTokens = await this.secureStorage.get('auth_tokens');
      if (secureTokens) {
        const tokens = JSON.parse(secureTokens) as IAuthTokens;
        if (!this.isTokenExpired(tokens.accessToken)) {
          return tokens.accessToken;
        }
      }

      return null;
    } catch (error) {
      console.error('Token retrieval failed:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      //INFO: check cookies first
      const cookieToken = this.cookieStorage.get('refresh_token');
      if (cookieToken) return cookieToken;

      //INFO: check secure storage
      const secureTokens = await this.secureStorage.get('auth_tokens');
      if (secureTokens) {
        const tokens = JSON.parse(secureTokens) as IAuthTokens;
        return tokens.refreshToken;
      }

      return null;
    } catch (error) {
      console.error('Refresh token retrieval failed:', error);
      return null;
    }
  }

  async updateAccessToken(accessToken: string): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const decoded = this.decodeToken(accessToken);
    if (!decoded?.exp) throw new Error('Invalid token');

    await this.setTokens({
      accessToken,
      refreshToken,
      expiresAt: decoded.exp * 1000,
    });
  }

  decodeToken(token: string): IDecodedToken | null {
    try {
      //INFO: check memory cache
      const cached = this.memoryCache.get('decoded_token') as IDecodedToken;
      if (cached) return cached;

      const decoded = jwtDecode<IDecodedToken>(token);
      this.memoryCache.set('decoded_token', decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;

    //INFO: add 30-second buffer
    return Date.now() >= decoded.exp * 1000 - 30000;
  }

  async clearTokens(): Promise<void> {
    this.cookieStorage.delete('access_token');
    this.cookieStorage.delete('refresh_token');
    await this.secureStorage.remove('auth_tokens');
    this.memoryCache.clear();
  }

  async getCurrentUser(): Promise<IDecodedToken | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    return this.decodeToken(token);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  getTokenExpiry(token: string): number | null {
    const decoded = this.decodeToken(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  }
}

export const tokenManager = TokenManager.getInstance();

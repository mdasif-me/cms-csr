/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenManager } from '@/lib/auth/core/token-manager';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './axios-client';

export class RequestInterceptor {
  static async onRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    //NOTE: add auth token if required
    const requiresAuth = config.headers?.['requires-auth'] !== 'false';

    if (requiresAuth) {
      const token = await tokenManager.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    //NOTE: add default headers
    config.headers['Content-Type'] = 'application/json';
    config.headers['X-Client'] = 'nextjs-web';
    config.headers['X-Client-Version'] =
      process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

    //NOTE: remove custom headers
    delete config.headers?.['requires-auth'];

    return config;
  }

  static onRequestError(error: any): Promise<never> {
    return Promise.reject(error);
  }
}

export class ResponseInterceptor {
  private static isRefreshing = false;
  private static refreshSubscribers: ((token: string) => void)[] = [];

  static onResponse(response: AxiosResponse): AxiosResponse {
    // you can transform response data here
    return response;
  }

  static async onResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // skip token refresh for auth endpoints (login, register, etc.)
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/verify-email') ||
      originalRequest.url?.includes('/auth/reset-password') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/refresh');

    // handle 401 Unauthorized (but not for auth endpoints)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (ResponseInterceptor.isRefreshing) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
          ResponseInterceptor.refreshSubscribers.push((token: string) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            resolve(apiClient.axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      ResponseInterceptor.isRefreshing = true;

      try {
        // try to refresh token
        const newToken = await ResponseInterceptor.refreshAccessToken();

        // update token
        await tokenManager.updateAccessToken(newToken);

        // update original request
        originalRequest.headers!.Authorization = `Bearer ${newToken}`;

        // retry all queued requests
        ResponseInterceptor.refreshSubscribers.forEach((cb) => cb(newToken));
        ResponseInterceptor.refreshSubscribers = [];

        return apiClient.axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh failed - clear tokens and redirect
        await tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        ResponseInterceptor.isRefreshing = false;
      }
    }

    // handle other errors
    const responseData = error.response?.data as any;
    const apiError = {
      status: error.response?.status || 500,
      message: responseData?.message || error.message || 'An error occurred',
      code: responseData?.code || responseData?.error,
      details: responseData?.details,
    };

    return Promise.reject(apiError);
  }

  private static async refreshAccessToken(): Promise<string> {
    const refreshToken = await tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ accessToken: string }>(
      '/auth/refresh',
      {
        refreshToken,
      }
    );

    return response.data.accessToken;
  }
}

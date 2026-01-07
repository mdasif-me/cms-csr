/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiError } from '../client/types';

export class ErrorHandler {
  static handle(error: any): IApiError {
    if (this.isApiError(error)) {
      return error;
    }

    if (this.isNetworkError(error)) {
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    }

    if (this.isTimeoutError(error)) {
      return {
        status: 408,
        message: 'Request timeout. Please try again.',
        code: 'TIMEOUT',
      };
    }

    // default error
    return {
      status: 500,
      message: 'An unexpected error occurred.',
      code: 'INTERNAL_ERROR',
    };
  }

  static isApiError(error: any): error is IApiError {
    return (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      'message' in error
    );
  }

  static isNetworkError(error: any): boolean {
    return error?.message?.includes('Network Error') || !navigator.onLine;
  }

  static isTimeoutError(error: any): boolean {
    return (
      error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')
    );
  }

  static isUnauthorized(error: any): boolean {
    return error?.status === 401;
  }

  static isForbidden(error: any): boolean {
    return error?.status === 403;
  }

  static isNotFound(error: any): boolean {
    return error?.status === 404;
  }

  static getErrorMessage(
    error: any,
    fallback: string = 'An error occurred'
  ): string {
    if (this.isApiError(error)) {
      return error.message;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return fallback;
  }
}

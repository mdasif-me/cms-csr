/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  code?: string;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export interface IRequestConfig {
  requires_auth?: boolean;
  content_type?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export interface ICacheConfig {
  enabled?: boolean;
  ttl?: number; //INFO: time to live in milliseconds
  key?: string;
}

export type TApiResponse<T = unknown> = {
  success: boolean;
  data: T;
  message: string;
};

export type TApiError = {
  message: string;
  code?: string;
  details?: unknown;
};

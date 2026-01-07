import { z } from 'zod';
import { loginSchema, registerSchema } from '../../features/auth';
import { apiClient } from '../client/axios-client';
import { IApiResponse } from '../client/types';

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    photo: string;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<IApiResponse<ILoginResponse>> => {
    const validated = loginSchema.parse(data);
    const response = await apiClient.post<ILoginResponse>(
      '/auth/login',
      validated
    );
    return response;
  },

  register: async (data: RegisterRequest) => {
    const validated = registerSchema.parse(data);
    const response = await apiClient.post('/auth/register', validated);
    return response;
  },

  resendVerificationEmail: async (email: string) => {
    const response = await apiClient.post('/auth/resend-verification-email', {
      email,
    });
    return response;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return response;
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response;
  },
};

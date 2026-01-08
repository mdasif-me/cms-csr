import Cookies from 'universal-cookie';
import { apolloClient } from '../apollo-client';
import {
  FORGOT_PASSWORD,
  REFRESH_TOKEN,
  RESET_PASSWORD,
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTRATION,
} from '../mutations/auth.mutations';
import type { TApiResponse } from '../types/api.types';
import type {
  IForgotPasswordInput,
  IForgotPasswordResponse,
  IForgotPasswordVariables,
  ILoginUserInput,
  IRefreshTokenResponse,
  IRefreshTokenVariables,
  IRegisterUserInput,
  IResetPasswordInput,
  IResetPasswordResponse,
  IResetPasswordVariables,
  ITokenData,
  IUserData,
  IUserLoginResponse,
  IUserLoginVariables,
  IUserLogoutResponse,
  IUserRegistrationResponse,
  IUserRegistrationVariables,
} from '../types/auth.types';

const cookies = new Cookies();

export const graphqlAuthApi = {
  login: async (
    input: ILoginUserInput
  ): Promise<TApiResponse<IUserData & { tokens: ITokenData }>> => {
    try {
      const result = await apolloClient.mutate<
        IUserLoginResponse,
        IUserLoginVariables
      >({
        mutation: USER_LOGIN,
        variables: { input },
      });

      if (result.error) {
        throw result.error;
      }

      if (!result.data?.userLogin?.edge?.data) {
        throw new Error('Invalid response from server');
      }

      const userData = result.data.userLogin.edge.data;
      const { tokens } = userData;

      cookies.set('access_token', tokens.accessToken, {
        path: '/',
        expires: new Date(tokens.accessTokenExpiresAt),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      cookies.set('refresh_token', tokens.refreshToken, {
        path: '/',
        expires: new Date(tokens.refreshTokenExpiresAt),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return {
        success: true,
        data: userData,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('GraphQL Login Error:', error);
      throw error;
    }
  },

  register: async (
    input: IRegisterUserInput
  ): Promise<TApiResponse<IUserData>> => {
    try {
      const result = await apolloClient.mutate<
        IUserRegistrationResponse,
        IUserRegistrationVariables
      >({
        mutation: USER_REGISTRATION,
        variables: { input },
      });

      if (result.error) {
        throw result.error;
      }

      if (!result.data?.userRegistration?.edge?.data) {
        throw new Error('Invalid response from server');
      }

      const userData = result.data.userRegistration.edge.data;

      return {
        success: true,
        data: userData,
        message:
          'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      console.error('GraphQL Registration Error:', error);
      throw error;
    }
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<TApiResponse<ITokenData>> => {
    try {
      const result = await apolloClient.mutate<
        IRefreshTokenResponse,
        IRefreshTokenVariables
      >({
        mutation: REFRESH_TOKEN,
        variables: { input: { refreshToken } },
      });

      if (result.error) {
        throw result.error;
      }

      const tokens = result.data?.refreshToken?.edge?.data;

      if (!tokens) {
        throw new Error('Invalid response from server');
      }

      cookies.set('access_token', tokens.accessToken, {
        path: '/',
        expires: new Date(tokens.accessTokenExpiresAt),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      cookies.set('refresh_token', tokens.refreshToken, {
        path: '/',
        expires: new Date(tokens.refreshTokenExpiresAt),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return {
        success: true,
        data: tokens,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      console.error('GraphQL Refresh Token Error:', error);
      throw error;
    }
  },

  forgotPassword: async (
    input: IForgotPasswordInput
  ): Promise<TApiResponse<IUserData>> => {
    try {
      const result = await apolloClient.mutate<
        IForgotPasswordResponse,
        IForgotPasswordVariables
      >({
        mutation: FORGOT_PASSWORD,
        variables: { input },
      });

      if (result.error) {
        throw result.error;
      }

      const userData = result.data?.forgotPassword?.edge?.data;
      if (!userData) {
        throw new Error('Invalid response from server');
      }

      return {
        success: true,
        data: userData,
        message: 'Password reset instructions have been sent to your email.',
      };
    } catch (error) {
      console.error('GraphQL Forgot Password Error:', error);
      throw error;
    }
  },

  resetPassword: async (
    input: IResetPasswordInput
  ): Promise<TApiResponse<IUserData>> => {
    try {
      const result = await apolloClient.mutate<
        IResetPasswordResponse,
        IResetPasswordVariables
      >({
        mutation: RESET_PASSWORD,
        variables: { input },
      });

      if (result.error) {
        throw result.error;
      }

      const userData = result.data?.resetPassword?.edge?.data;
      if (!userData) {
        throw new Error('Invalid response from server');
      }

      return {
        success: true,
        data: userData,
        message: 'Password has been reset successfully.',
      };
    } catch (error) {
      console.error('GraphQL Reset Password Error:', error);
      throw error;
    }
  },

  logout: async (): Promise<TApiResponse<null>> => {
    try {
      const result = await apolloClient.mutate<IUserLogoutResponse>({
        mutation: USER_LOGOUT,
      });

      if (result.error) {
        throw result.error;
      }
      cookies.remove('access_token', { path: '/' });
      cookies.remove('refresh_token', { path: '/' });
      await apolloClient.clearStore();

      return {
        success: true,
        data: null,
        message: result.data?.userLogout?.message || 'Logout successful',
      };
    } catch (error) {
      console.error('GraphQL Logout Error:', error);
      cookies.remove('access_token', { path: '/' });
      cookies.remove('refresh_token', { path: '/' });
      throw error;
    }
  },
};

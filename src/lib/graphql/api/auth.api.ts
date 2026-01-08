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
  IUserLoginResponse,
  IUserLoginVariables,
  IUserLogoutResponse,
  IUserRegistrationResponse,
  IUserRegistrationVariables,
} from '../types/auth.types';

const cookies = new Cookies();

/**
 * GraphQL Auth API Service
 * Complete authentication service for all auth operations
 */
export const graphqlAuthApi = {
  /**
   * User Login
   * @param input - Login credentials (email, password, remember_me)
   * @returns User data with tokens
   */
  login: async (input: ILoginUserInput) => {
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

      // Store tokens in cookies
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

  /**
   * User Registration
   * @param input - Registration data
   * @returns Registered user data
   */
  register: async (input: IRegisterUserInput) => {
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

  /**
   * Refresh Access Token
   * @param refreshToken - Refresh token
   * @returns New tokens
   */
  refreshToken: async (refreshToken: string) => {
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

      if (tokens) {
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
      }

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

  /**
   * Forgot Password
   * @param input - Email and reminder method
   * @returns Success response
   */
  forgotPassword: async (input: IForgotPasswordInput) => {
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

      return {
        success: true,
        data: result.data?.forgotPassword?.edge?.data,
        message: 'Password reset instructions have been sent to your email.',
      };
    } catch (error) {
      console.error('GraphQL Forgot Password Error:', error);
      throw error;
    }
  },

  /**
   * Reset Password
   * @param input - Email and new password
   * @returns Updated user data
   */
  resetPassword: async (input: IResetPasswordInput) => {
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

      return {
        success: true,
        data: result.data?.resetPassword?.edge?.data,
        message: 'Password has been reset successfully.',
      };
    } catch (error) {
      console.error('GraphQL Reset Password Error:', error);
      throw error;
    }
  },

  /**
   * User Logout
   */
  logout: async () => {
    try {
      const result = await apolloClient.mutate<IUserLogoutResponse>({
        mutation: USER_LOGOUT,
      });

      if (result.error) {
        throw result.error;
      }

      // Clear tokens from cookies
      cookies.remove('access_token', { path: '/' });
      cookies.remove('refresh_token', { path: '/' });

      // Clear Apollo cache
      await apolloClient.clearStore();

      return {
        success: true,
        message: result.data?.userLogout?.message || 'Logout successful',
      };
    } catch (error) {
      console.error('GraphQL Logout Error:', error);
      // Clear cookies even if request fails
      cookies.remove('access_token', { path: '/' });
      cookies.remove('refresh_token', { path: '/' });
      throw error;
    }
  },
};

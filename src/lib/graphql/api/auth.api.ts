import Cookies from 'universal-cookie';
import { apolloClient } from '../apollo-client';
import {
  REFRESH_TOKEN,
  USER_LOGIN,
  USER_LOGOUT,
} from '../mutations/auth.mutations';
import type {
  ILoginUserInput,
  IUserLoginResponse,
  IUserLoginVariables,
} from '../types/auth.types';

const cookies = new Cookies();

/**
 * GraphQL Auth API Service
 * This service wraps the GraphQL mutations to provide a clean API
 * that matches your existing REST API structure for easy migration
 */
export const graphqlAuthApi = {
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

      const data = result.data;

      const userData = data.userLogin.edge.data;
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

  // refresh token
  refreshToken: async (refreshToken: string) => {
    try {
      const result = await apolloClient.mutate<{
        refreshToken: {
          accessToken: string;
          accessTokenExpiresAt: string;
          refreshToken: string;
          refreshTokenExpiresAt: string;
        };
      }>({
        mutation: REFRESH_TOKEN,
        variables: { refreshToken },
      });

      if (result.error) {
        throw result.error;
      }

      const tokens = result.data?.refreshToken;

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
      };
    } catch (error) {
      console.error('GraphQL Refresh Token Error:', error);
      throw error;
    }
  },

  // logout
  logout: async () => {
    try {
      const result = await apolloClient.mutate<{
        userLogout: {
          success: boolean;
          message: string;
        };
      }>({
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

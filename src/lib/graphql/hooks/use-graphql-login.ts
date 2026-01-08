'use client';

import { USER_LOGIN } from '@/lib/graphql/mutations/auth.mutations';
import type {
  ILoginUserInput,
  IUserLoginResponse,
  IUserLoginVariables,
} from '@/lib/graphql/types/auth.types';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import { apolloClient } from '../apollo-client';

const cookies = new Cookies();

/**
 * Custom hook for GraphQL user login
 *
 * @example
 * ```tsx
 * const LoginComponent = () => {
 *   const { loginUser, loading, error, data } = useGraphQLLogin();
 *
 *   const handleSubmit = async (values) => {
 *     try {
 *       const result = await loginUser({
 *         email: values.email,
 *         password: values.password,
 *         remember_me: values.remember_me
 *       });
 *       console.log('Login successful:', result.data);
 *     } catch (err) {
 *       console.error('Login failed:', err);
 *     }
 *   };
 *
 *   return (
 *     // Your login form JSX
 *   );
 * };
 * ```
 */
export const useGraphQLLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<IUserLoginResponse | null>(null);

  const loginUser = async (input: ILoginUserInput) => {
    try {
      setLoading(true);
      setError(null);

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

      if (result.data?.userLogin?.edge?.data) {
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

        setData(result.data);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    loading,
    error,
    data,
  };
};

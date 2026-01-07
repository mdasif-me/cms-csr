import { authApi } from '@/lib/api/endpoints';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { tokenManager, type IDecodedToken } from '../core/token-manager';

interface IUseAuthReturn {
  user: IDecodedToken | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    accept_terms: boolean
  ) => Promise<void>;
  login: (
    email: string,
    password: string,
    remember_me?: boolean
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export function useAuth(): IUseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<IDecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const currentUser = await tokenManager.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember_me?: boolean) => {
      setIsLoading(true);
      try {
        const response = await authApi.login({ email, password, remember_me });
        const data = response.data;
        toast.success(response.message);

        await tokenManager.setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: Date.now() + data.expires_in * 1000,
        });

        const userData = tokenManager.decodeToken(data.access_token);
        setUser(userData);

        // redirect based on role or return URL
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo =
          searchParams.get('redirect') || getDefaultRoute(userData?.role);

        router.push(redirectTo);
        router.refresh(); // refresh server components
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
        console.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      confirm_password: string,
      accept_terms: boolean
    ) => {
      setIsLoading(true);
      try {
        const response = await authApi.register({
          name,
          email,
          password,
          confirm_password,
          accept_terms,
        });
        toast.success(response.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.message || 'Registration failed');
        console.error('Registration failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyEmail = useCallback(
    async (token: string) => {
      setIsLoading(true);
      try {
        const response = await authApi.verifyEmail(token);
        toast.success(response.message);

        await refreshUser();
        router.push('/login');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
        console.error('Email verification failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const resendVerificationEmail = useCallback(
    async (email: string) => {
      setIsLoading(true);
      try {
        const response = await authApi.resendVerificationEmail(email);
        toast.success(response.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
        console.error('Email verification failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setIsLoading(true);
      try {
        const response = await authApi.resetPassword(token, newPassword);
        toast.success(
          response.message || 'Password has been reset successfully.'
        );
        router.push('/login');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await tokenManager.clearTokens();
      setUser(null);

      // clear any cached data
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      router.push('/login');
      router.refresh();
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await tokenManager.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('User refresh failed:', error);
      setUser(null);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user?.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.role === role;
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user?.permissions) return false;
      return permissions.some((permission) =>
        user.permissions?.includes(permission)
      );
    },
    [user]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!user?.permissions) return false;
      return permissions.every((permission) =>
        user.permissions?.includes(permission)
      );
    },
    [user]
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    verifyEmail,
    resendVerificationEmail,
    resetPassword,
    forgotPassword,
    logout,
    refreshUser,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  };
}

function getDefaultRoute(role?: string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    default:
      return '/dashboard';
  }
}
